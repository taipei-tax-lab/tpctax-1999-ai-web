"""Fail closed on extra files, stale payloads or credential material before Pages upload."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    'index.html', 'docs/IT_HANDOFF.md', 'MANIFEST.json',
    'assets/config.js', 'assets/styles.css', 'assets/app.js', 'assets/analytics.js',
    'assets/result-model.js', 'assets/messenger-transport.js',
    'assets/trs-logo.gif', 'assets/trs-header.png', 'assets/official-page-bg.png',
}
PATTERNS = [
    r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    r'"type"\s*:\s*"service_account"', r'"private_key"\s*:',
    r'AIza[0-9A-Za-z_-]{30,}', r'(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}',
    r'ya29\.[A-Za-z0-9_-]{15,}',
    r'(?:access_token|refresh_token|client_secret|api_key)\s*[:=]\s*[\x22\x27][^\x22\x27]{8,}',
    r'eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}',
]


def verify(archive, destination=None):
    with zipfile.ZipFile(archive) as z:
        names = z.namelist()
        assert len(names) == len(EXPECTED) and set(names) == EXPECTED, 'Unexpected ZIP payload'
        assert z.testzip() is None, 'ZIP CRC failure'
        manifest = json.loads(z.read('MANIFEST.json'))['payloads']
        assert set(manifest) == EXPECTED - {'MANIFEST.json'}, 'Incomplete manifest'
        for name, item in manifest.items():
            data = z.read(name)
            assert len(data) == item['bytes'], f'Byte count mismatch: {name}'
            assert hashlib.sha256(data).hexdigest() == item['sha256'], f'Hash mismatch: {name}'
            assert data == (ROOT / name).read_bytes(), f'Stale source payload: {name}'
        for name in names:
            if name.endswith(('.html', '.js', '.css', '.md', '.json')):
                assert not any(re.search(p, z.read(name).decode()) for p in PATTERNS), f'Credential pattern: {name}'
        assert 'liveEnabled: true' in z.read('assets/config.js').decode(), 'Release must be live-enabled'
        assert 'data-demo' not in z.read('index.html').decode(), 'Demo entry forbidden'
        if destination:
            assert not destination.exists(), 'Extract into a new empty directory only'
            z.extractall(destination)
            actual = {p.relative_to(destination).as_posix() for p in destination.rglob('*') if p.is_file()}
            assert actual == EXPECTED
            assert all((destination / name).read_bytes() == z.read(name) for name in names)
    return {'status': 'PASS', 'files': len(EXPECTED), 'sha256': hashlib.sha256(archive.read_bytes()).hexdigest()}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('archive', type=Path)
    parser.add_argument('--extract', type=Path)
    args = parser.parse_args()
    print(json.dumps(verify(args.archive, args.extract)))
