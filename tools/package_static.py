"""Build reproducible static hosting/demo ZIPs. No network or deployment actions."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT
ASSETS = ['config.js', 'styles.css', 'app.js', 'analytics.js', 'result-model.js', 'messenger-transport.js', 'trs-logo.gif', 'trs-header.png', 'official-page-bg.png']
DOCS = ['README.md', 'docs/HOSTING.md', 'docs/RESULT_CONTRACT.md', 'docs/OFFICIAL_SITE_HANDOFF.md', 'docs/VISUAL_REFERENCE.md']
IT_DOCS = ['docs/IT_HANDOFF.md']

def digest(data):
    return hashlib.sha256(data).hexdigest()

def make_zip(destination, payloads):
    manifest = {name: {'bytes': len(data), 'sha256': digest(data)} for name, data in sorted(payloads.items())}
    payloads = {**payloads, 'MANIFEST.json': json.dumps({'payloads':manifest},ensure_ascii=False,indent=2).encode()}
    with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name, data in sorted(payloads.items()):
            entry=zipfile.ZipInfo(name, date_time=(2026,10,7,0,0,0))
            entry.compress_type=zipfile.ZIP_DEFLATED
            entry.external_attr=0o100644 << 16
            z.writestr(entry,data)
    with zipfile.ZipFile(destination) as z:
        assert z.testzip() is None
        for name, expected in manifest.items():
            assert digest(z.read(name)) == expected['sha256']
    return {'file':destination.name,'bytes':destination.stat().st_size,'sha256':digest(destination.read_bytes()),'payloads':manifest}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output-dir',type=Path,required=True)
    args=parser.parse_args();args.output_dir.mkdir(parents=True,exist_ok=True)
    hosting={name:(SOURCE/name).read_bytes() for name in ['index.html',*IT_DOCS]}
    hosting.update({f'assets/{name}':(SOURCE/'assets'/name).read_bytes() for name in ASSETS})
    demo={**hosting,**{name:(SOURCE/name).read_bytes() for name in DOCS},'demo.html':(SOURCE/'demo.html').read_bytes(),'demo/mock-messenger.js':(SOURCE/'demo/mock-messenger.js').read_bytes()}
    summary={'hosting':make_zip(args.output_dir/'hosting.zip',hosting),'demo':make_zip(args.output_dir/'demo.zip',demo)}
    (args.output_dir/'package_summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
    print(json.dumps({k:{f:v for f,v in obj.items() if f!='payloads'} for k,obj in summary.items()}))

if __name__ == '__main__': main()
