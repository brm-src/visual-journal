# visual journal

Proyecto privado de Cris. No es Moodwatch y no está publicado.

Tesis: foto propia → prosa → recomendaciones de literatura, cine, música y arte según el mood de esa imagen.

## Cómo usarlo ahora

```bash
cd ~/Developer/visual-journal
python3 -m http.server 4181
```

Abrir: http://127.0.0.1:4181/

## Agregar una foto

```bash
python3 scripts/add-entry.py /ruta/a/foto.jpg "título de la entrada"
```

El script copia la foto a `assets/photos/`, agrega una entrada base en `data/entries.json` y deja campos editables para prosa/recomendaciones.

## Privacidad

- No hay backend.
- No está conectado a Moodwatch.
- No hay remote git configurado.
- `assets/photos/*` está ignorado por git para evitar subir fotos privadas por accidente.
