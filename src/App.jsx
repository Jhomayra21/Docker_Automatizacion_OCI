import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  Cloud,
  Code2,
  Container,
  Copy,
  GitBranch,
  GitCommitHorizontal,
  Globe2,
  Menu,
  PackageCheck,
  Play,
  RefreshCw,
  Rocket,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
  X,
  Zap,
} from 'lucide-react'

const pipeline = [
  { icon: GitBranch, label: 'GitHub', detail: 'Push a main', tone: 'blue' },
  { icon: Workflow, label: 'Actions', detail: 'Build automático', tone: 'violet' },
  { icon: Container, label: 'Docker Hub', detail: 'Imagen versionada', tone: 'cyan' },
  { icon: Cloud, label: 'OCI', detail: 'Deploy por SSH', tone: 'orange' },
]

const runs = [
  { commit: 'feat: pipeline CI/CD', sha: 'a91c2f8', time: 'hace 2 min', status: 'Exitoso' },
  { commit: 'style: interfaz responsive', sha: '6e42bd1', time: 'hace 18 min', status: 'Exitoso' },
  { commit: 'build: contenedor nginx', sha: 'd37a0e5', time: 'hace 1 h', status: 'Exitoso' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [progress, setProgress] = useState(100)
  const [lastDeploy, setLastDeploy] = useState(new Date())

  useEffect(() => {
    if (!deploying) return undefined
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(timer)
          setDeploying(false)
          setLastDeploy(new Date())
          return 100
        }
        return value + 10
      })
    }, 120)
    return () => window.clearInterval(timer)
  }, [deploying])

  const simulateDeploy = () => {
    setProgress(0)
    setDeploying(true)
  }

  const copyCommand = async () => {
    await navigator.clipboard.writeText('docker pull jhomp/docker-automatizacion-oci:latest')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="site-shell">
      <header className="header">
        <a className="brand" href="#inicio" aria-label="DeployFlow, inicio">
          <span className="brand-icon"><Workflow size={20} /></span>
          <span>Deploy<span>Flow</span></span>
          <em>OCI</em>
        </a>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#pipeline" onClick={() => setMenuOpen(false)}>Pipeline</a>
          <a href="#ejecuciones" onClick={() => setMenuOpen(false)}>Ejecuciones</a>
          <a href="#arquitectura" onClick={() => setMenuOpen(false)}>Arquitectura</a>
        </nav>

        <div className="header-side">
          <span className="live-pill"><i /> PRODUCCIÓN ACTIVA</span>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menú">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Zap size={14} /> ENTREGA CONTINUA AUTOMATIZADA</div>
            <h1>Del commit a<br /><span>producción.</span></h1>
            <p>
              Cada cambio enviado a GitHub activa un pipeline que valida el código,
              construye una imagen Docker y despliega la nueva versión en Oracle Cloud.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#pipeline"><Play size={16} fill="currentColor" /> Explorar pipeline</a>
              <a className="button ghost" href="#arquitectura"><Code2 size={16} /> Ver arquitectura</a>
            </div>
            <div className="repo-line">
              <GitBranch size={16} />
              <span>Jhomayra21 / Docker_Automatizacion_OCI</span>
              <span className="branch">main</span>
            </div>
          </div>

          <div className="action-window">
            <div className="window-top">
              <div><i /><i /><i /></div>
              <span>GitHub Actions · deploy.yml</span>
              <GitBranch size={15} />
            </div>
            <div className="workflow-title">
              <span className="success-mark"><Check /></span>
              <div><small>WORKFLOW RUN</small><strong>CI/CD Docker + OCI</strong></div>
              <span className="run-time">42s</span>
            </div>
            <div className="job-list">
              {[
                ['Validar aplicación React', '8s'],
                ['Construir imagen Docker', '17s'],
                ['Publicar en Docker Hub', '9s'],
                ['Desplegar en OCI', '8s'],
              ].map(([name, time], index) => (
                <div className="job" key={name}>
                  <span><Check size={13} /></span>
                  <div><strong>{name}</strong><small>Job completado correctamente</small></div>
                  <em>{time}</em>
                  {index < 3 && <i className="job-line" />}
                </div>
              ))}
            </div>
            <div className="window-footer"><GitCommitHorizontal size={14} /> a91c2f8 · push realizado por Jhomayra21</div>
          </div>
        </section>

        <section className="stats-strip">
          <div><Activity /><span><small>ESTADO</small><strong>Operativo</strong></span></div>
          <div><Rocket /><span><small>DESPLIEGUES</small><strong>Automáticos</strong></span></div>
          <div><Box /><span><small>IMAGEN</small><strong>latest</strong></span></div>
          <div><Globe2 /><span><small>ENTORNO</small><strong>OCI Compute</strong></span></div>
        </section>

        <section className="section pipeline-section" id="pipeline">
          <div className="section-heading">
            <div>
              <span className="section-label">FLUJO DE ENTREGA</span>
              <h2>Un push. Cuatro etapas.</h2>
              <p>GitHub Actions conecta todo el proceso y deja una trazabilidad clara de cada despliegue.</p>
            </div>
            <span className="secure"><ShieldCheck size={17} /> Secretos cifrados</span>
          </div>

          <div className="pipeline-flow">
            {pipeline.map(({ icon: Icon, label, detail, tone }, index) => (
              <div className="pipeline-wrap" key={label}>
                <article className="pipeline-card">
                  <div className={`pipeline-icon ${tone}`}><Icon /></div>
                  <span className="stage">ETAPA 0{index + 1}</span>
                  <h3>{label}</h3>
                  <p>{detail}</p>
                  <div className="done"><Check size={12} /> COMPLETADO</div>
                </article>
                {index < pipeline.length - 1 && <ArrowRight className="pipeline-arrow" />}
              </div>
            ))}
          </div>
        </section>

        <section className="section runs-section" id="ejecuciones">
          <div className="runs-copy">
            <span className="section-label">HISTORIAL</span>
            <h2>Cada cambio queda registrado.</h2>
            <p>Los commits, tiempos y resultados del pipeline pueden consultarse directamente en la pestaña Actions.</p>
            <button className="simulate" onClick={simulateDeploy} disabled={deploying}>
              <RefreshCw size={16} className={deploying ? 'spin' : ''} />
              {deploying ? `Desplegando ${progress}%` : 'Simular nuevo despliegue'}
            </button>
            <small>Último despliegue: {lastDeploy.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</small>
          </div>

          <div className="runs-panel">
            <div className="panel-header"><span>Últimas ejecuciones</span><span><i /> main</span></div>
            {runs.map((run) => (
              <div className="run-row" key={run.sha}>
                <span className="check-circle"><Check size={14} /></span>
                <div><strong>{run.commit}</strong><small>{run.sha} · {run.time}</small></div>
                <em>{run.status}</em>
                <ChevronRight size={15} />
              </div>
            ))}
          </div>
        </section>

        <section className="section architecture" id="arquitectura">
          <div className="arch-copy">
            <span className="section-label">ARQUITECTURA</span>
            <h2>Despliegue reproducible y seguro.</h2>
            <p>La aplicación compilada se sirve con Nginx dentro de un contenedor ligero. OCI solo necesita Docker y acceso al repositorio de imágenes.</p>
            <ul>
              <li><Check /> Tokens almacenados en GitHub Secrets</li>
              <li><Check /> Imagen etiquetada con el SHA del commit</li>
              <li><Check /> Health check después del despliegue</li>
            </ul>
          </div>

          <div className="terminal-card">
            <div className="terminal-top"><Terminal size={14} /><span>ubuntu@oci:~</span><i /></div>
            <div className="terminal-body">
              <p><b>$</b> docker ps --filter name=deployflow</p>
              <div className="terminal-result"><span>IMAGE</span><span>STATUS</span><strong>jhomp/docker-automatizacion-oci</strong><strong className="up">● Up 2 minutes (healthy)</strong></div>
              <p><b>$</b> curl localhost/health</p>
              <p className="json">&#123; "status": "ok", "pipeline": "github-actions" &#125;</p>
              <button onClick={copyCommand}><code>docker pull jhomp/docker-automatizacion-oci:latest</code><span>{copied ? <Check size={14} /> : <Copy size={14} />}</span></button>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand"><span className="brand-icon"><Workflow size={17} /></span><span>Deploy<span>Flow</span></span></div>
        <p>Proyecto académico · GitHub Actions + Docker + Oracle Cloud</p>
        <div className="footer-icons"><GitBranch /><Container /><Server /></div>
      </footer>
    </div>
  )
}

export default App
