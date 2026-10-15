# Docker Automatización OCI

Práctica de integración y despliegue continuo con **React, Docker, GitHub Actions, Docker Hub y una máquina virtual de Oracle Cloud Infrastructure (OCI)**.

Cada `push` enviado a la rama `main` inicia automáticamente el workflow de GitHub Actions:

```text
Código en GitHub
      │ push a main
      ▼
GitHub Actions
      ├── npm ci + npm run build
      ├── docker build
      ├── docker push a Docker Hub
      └── conexión SSH a OCI
                    │
                    ▼
              docker pull + run
                    │
                    ▼
              Aplicación en puerto 80
```

## Tecnologías

- React y Vite
- Docker multi-stage
- Nginx Alpine
- GitHub Actions
- Docker Hub
- OCI Compute con Ubuntu

## Ejecutar localmente

```powershell
npm install
npm run dev
```

Abrir `http://localhost:5173`.

## Probar con Docker

```powershell
docker build -t docker-automatizacion-oci:local .
docker run -d -p 8080:80 --name deployflow docker-automatizacion-oci:local
```

Abrir:

```text
http://localhost:8080
```

Comprobar la salud del contenedor:

```powershell
curl.exe http://localhost:8080/health
```

También se puede usar Compose:

```powershell
docker compose up -d --build
docker compose ps
```

## Workflow de GitHub Actions

El archivo principal es:

```text
.github/workflows/cicd.yml
```

Contiene tres trabajos dependientes:

1. **Validar aplicación React:** instala las dependencias y ejecuta la compilación.
2. **Construir y publicar en Docker Hub:** crea la imagen y publica dos etiquetas:
   - `latest`
   - El SHA completo del commit, por ejemplo `a91c2f8...`
3. **Desplegar automáticamente en OCI:** se conecta por SSH, descarga exactamente la imagen correspondiente al commit y reemplaza el contenedor.

También puede ejecutarse manualmente desde **Actions > CI/CD Docker Hub y OCI > Run workflow**.

## Repositorio requerido en Docker Hub

Crear un repositorio llamado:

```text
docker-automatizacion-oci
```

La imagen resultante tendrá este formato:

```text
USUARIO_DOCKERHUB/docker-automatizacion-oci:latest
```

## Crear el token de Docker Hub

1. Ingresar a Docker Hub.
2. Abrir **Account settings > Personal access tokens**.
3. Crear un token con permisos de lectura y escritura.
4. Copiarlo inmediatamente; Docker Hub no vuelve a mostrarlo.

No colocar el token ni la contraseña dentro del repositorio.

## Configurar GitHub Secrets

En el repositorio abrir:

```text
Settings > Secrets and variables > Actions > New repository secret
```

Crear exactamente estos cinco secretos:

| Secreto | Contenido |
|---|---|
| `DOCKER_USERNAME` | Usuario de Docker Hub, por ejemplo `jhomp` |
| `DOCKER_TOKEN` | Token personal de Docker Hub con lectura/escritura |
| `OCI_HOST` | IP pública actual de la VM, por ejemplo `155.181.158.252` |
| `OCI_USERNAME` | Usuario SSH; para Ubuntu normalmente `ubuntu` |
| `OCI_SSH_KEY` | Contenido completo de la clave SSH privada `.key` |

Para obtener el contenido de la clave privada desde PowerShell:

```powershell
Get-Content -Raw "C:\Users\jhomy\Downloads\ssh-key-2026-10-08.key"
```

Copiar toda la salida, incluidas estas líneas:

```text
-----BEGIN ... PRIVATE KEY-----
...
-----END ... PRIVATE KEY-----
```

La clave privada solamente debe guardarse en GitHub Secrets. Nunca debe añadirse a los archivos del proyecto ni subirse en un commit.

## Preparar la VM de OCI

La VM debe cumplir estos requisitos antes del primer despliegue automático:

- Estado `Running`.
- Docker instalado y activo.
- Puerto TCP 22 habilitado para SSH.
- Puerto TCP 80 habilitado para la aplicación.
- El usuario configurado en `OCI_USERNAME` debe tener acceso a `sudo docker`.

Comprobar manualmente la conexión:

```powershell
ssh -i "C:\Users\jhomy\Downloads\ssh-key-2026-10-08.key" ubuntu@IP_PUBLICA
```

Dentro de la VM:

```bash
sudo docker --version
sudo systemctl status docker
```

## Primer despliegue

Después de configurar todos los secretos:

```powershell
git add .
git commit -m "feat: automatizar despliegue con GitHub Actions y OCI"
git push origin main
```

En GitHub, abrir la pestaña **Actions**. Se deben observar en verde los trabajos:

```text
Validar aplicación React
Construir y publicar en Docker Hub
Desplegar automáticamente en OCI
```

Al finalizar, abrir:

```text
http://IP_PUBLICA
```

## Qué ejecuta el despliegue remoto

GitHub Actions realiza de forma remota el equivalente a:

```bash
sudo docker pull USUARIO_DOCKERHUB/docker-automatizacion-oci:SHA_DEL_COMMIT
sudo docker rm -f deployflow
sudo docker run -d \
  --name deployflow \
  --restart unless-stopped \
  -p 80:80 \
  USUARIO_DOCKERHUB/docker-automatizacion-oci:SHA_DEL_COMMIT
curl http://127.0.0.1/health
```

La etiqueta por SHA garantiza que OCI ejecute la misma imagen que se produjo para ese commit.

## Detener la VM después de la demostración

La VM actual utiliza una forma que puede consumir créditos mientras está en estado `Running`. Después de la entrega puede detenerse desde la consola de OCI. No es necesario eliminarla.

Al volver a iniciarla, el contenedor utiliza `--restart unless-stopped`, por lo que Docker debería iniciarlo automáticamente.

## Evidencias recomendadas

Guardar capturas de:

1. Archivos del proyecto en VS Code.
2. Contenido de `.github/workflows/cicd.yml`.
3. Los cinco nombres de Secrets, ocultando siempre sus valores.
4. Commit y `push` a `main`.
5. Workflow completo en verde en la pestaña Actions.
6. Imagen y etiquetas publicadas en Docker Hub.
7. `sudo docker ps` dentro de OCI.
8. Aplicación abierta desde la IP pública.
9. Respuesta del endpoint `/health`.

## Estructura

```text
Docker_Automatizacion_OCI/
├── .github/
│   └── workflows/
│       └── cicd.yml
├── scripts/
│   └── deploy-manual.sh
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .dockerignore
├── .gitignore
├── compose.yaml
├── Dockerfile
├── index.html
├── nginx.conf
├── package.json
└── README.md
```

## Seguridad

- No se almacenan contraseñas ni claves en el código.
- GitHub Secrets oculta los valores en los registros del workflow.
- Docker Hub se autentica usando un token, no la contraseña de la cuenta.
- El despliegue utiliza SSH con clave privada.
- La imagen Docker se sirve desde una etapa final mínima basada en Nginx Alpine.
