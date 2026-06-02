#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data' / 'entries.json'
PHOTOS = ROOT / 'assets' / 'photos'


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9áéíóúñü]+', '-', text)
    text = text.strip('-') or 'entrada'
    return text.encode('ascii', 'ignore').decode() or 'entrada'


def main() -> int:
    if len(sys.argv) < 3:
        print('uso: python3 scripts/add-entry.py /ruta/a/foto.jpg "título"')
        return 2

    source = Path(sys.argv[1]).expanduser().resolve()
    title = sys.argv[2].strip()
    if not source.exists():
        print(f'no existe: {source}')
        return 1
    if source.suffix.lower() not in {'.jpg', '.jpeg', '.png', '.webp'}:
        print('usa jpg/jpeg/png/webp')
        return 1

    entries = json.loads(DATA.read_text())
    slug = slugify(title)
    dest_name = f'{slug}{source.suffix.lower()}'
    dest = PHOTOS / dest_name
    n = 2
    while dest.exists():
        dest_name = f'{slug}-{n}{source.suffix.lower()}'
        dest = PHOTOS / dest_name
        n += 1

    PHOTOS.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, dest)

    entry = {
        'id': f'{slug}-{date.today().isoformat()}',
        'title': title,
        'date': date.today().isoformat(),
        'photo': f'./assets/photos/{dest_name}',
        'palette': ['#14120e', '#6d2d33', '#d8a778'],
        'moods': ['pendiente'],
        'prose': 'Escribir acá la prosa de esta foto.',
        'recommendations': {
            'cine': {'title': 'pendiente', 'by': 'pendiente'},
            'literatura': {'title': 'pendiente', 'by': 'pendiente'},
            'música': {'title': 'pendiente', 'by': 'pendiente'},
            'arte': {'title': 'pendiente', 'by': 'pendiente'},
        },
    }
    entries.insert(0, entry)
    DATA.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n')
    print(f'foto copiada: {dest}')
    print(f'entrada agregada: {entry["id"]}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
