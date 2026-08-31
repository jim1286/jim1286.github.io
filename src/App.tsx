import type { ReactNode } from 'react';
import {
  AndroidFilled,
  AppleFilled,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ExportOutlined,
  GithubOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { apps, legalDocuments } from './siteData';
import './styles/site.css';

const developerEmail = 'jimin1286@gmail.com';
const githubProfile = 'https://github.com/jim1286';

function ExternalLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">본문 바로가기</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="황지민 개발자 사이트 홈">
          <span className="brand-mark">HJ</span>
          <span>Hwang Jimin</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#apps">Apps</a>
          <a href="#legal">Support &amp; Privacy</a>
          <a href="#developer">Developer</a>
        </nav>
        <a className="header-contact" href={`mailto:${developerEmail}`}>Contact <ExportOutlined /></a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span /> INDEPENDENT APP DEVELOPER · SEOUL</p>
            <h1>일상의 질문을<br /><em>쓸모 있는 앱</em>으로<br />만듭니다.</h1>
            <p className="hero-description">
              야구 기록부터 햇빛을 피하는 좌석, 오프라인 비행 정보까지.<br />
              작지만 분명한 문제를 발견하고 직접 설계하고 출시합니다.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#apps">앱 둘러보기 <ArrowRightOutlined /></a>
              <ExternalLink className="button button-secondary" href={githubProfile}><GithubOutlined /> GitHub</ExternalLink>
            </div>
          </div>

          <aside className="hero-panel" aria-label="포트폴리오 현황">
            <p className="panel-label">PORTFOLIO / 2026</p>
            <div className="metric"><strong>05</strong><span>관리 중인 앱</span></div>
            <div className="metric"><strong>02</strong><span>스토어 공개 앱</span></div>
            <div className="metric"><strong>02</strong><span>지원 플랫폼</span></div>
            <div className="panel-footer"><span>iOS</span><span>Android</span><span>Web</span></div>
          </aside>
        </section>

        <section className="section apps-section" id="apps">
          <div className="section-heading">
            <div><p className="section-index">01 / APPS</p><h2>만든 앱</h2></div>
            <p>직접 기획하고 개발하는 제품입니다.<br />출시 상태와 공식 링크를 함께 제공합니다.</p>
          </div>

          <div className="app-grid">
            {apps.map((app) => (
              <article className={`app-card ${app.featured ? 'featured' : ''}`} key={app.id}>
                <div className="app-card-top">
                  <img src={app.icon} alt="" className="app-icon" />
                  <span className={`status status-${app.statusTone}`}>{app.status}</span>
                </div>
                <p className="app-number">APP / {app.index}</p>
                <h3>{app.name}<small>{app.englishName}</small></h3>
                <p className="app-description">{app.description}</p>
                <ul className="tag-list" aria-label={`${app.name} 기술`}>
                  {app.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className="app-links">
                  {app.iosUrl && <ExternalLink href={app.iosUrl}><AppleFilled /> App Store</ExternalLink>}
                  {app.androidUrl && <ExternalLink href={app.androidUrl}><AndroidFilled /> Google Play</ExternalLink>}
                  <ExternalLink href={app.githubUrl}><GithubOutlined /> Source</ExternalLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section legal-section" id="legal">
          <div className="section-heading light">
            <div><p className="section-index">02 / SUPPORT &amp; PRIVACY</p><h2>공식 문서</h2></div>
            <p>스토어 이용자와 심사를 위한 앱별<br />개인정보처리방침 및 지원 채널입니다.</p>
          </div>

          <div className="legal-list">
            {legalDocuments.map((document) => (
              <article className="legal-row" key={document.id}>
                <div className="legal-identity">
                  <span>{document.index}</span>
                  <div><h3>{document.name}</h3><p>{document.note}</p></div>
                </div>
                <div className="legal-links">
                  <ExternalLink href={document.privacyUrl}>개인정보처리방침 <ExportOutlined /></ExternalLink>
                  {document.deletionUrl && <ExternalLink href={document.deletionUrl}>계정 삭제 <ExportOutlined /></ExternalLink>}
                  <ExternalLink href={document.supportUrl}>지원 <ExportOutlined /></ExternalLink>
                </div>
              </article>
            ))}
          </div>
          <p className="legal-note"><SafetyCertificateOutlined /> 공개 문서는 앱별 데이터 처리 방식과 지원 절차를 안내합니다.</p>
        </section>

        <section className="section developer-section" id="developer">
          <div className="developer-photo-wrap"><img src="/profile.jpg" alt="개발자 황지민" className="developer-photo" /><span>BASED IN SEOUL</span></div>
          <div className="developer-copy">
            <p className="section-index">03 / DEVELOPER</p>
            <h2>안녕하세요,<br />개발자 <em>황지민</em>입니다.</h2>
            <p>아이디어를 실제로 사용할 수 있는 제품으로 완성합니다. 모바일 앱의 기획, 디자인, 개발과 스토어 운영까지 전 과정을 직접 맡고 있습니다.</p>
            <dl>
              <div><dt>Developer</dt><dd>Hwang Jimin · 황지민</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${developerEmail}`}>{developerEmail}</a></dd></div>
              <div><dt>GitHub</dt><dd><ExternalLink href={githubProfile}>github.com/jim1286</ExternalLink></dd></div>
            </dl>
          </div>
        </section>

        <section className="contact-band">
          <p>CONTACT</p>
          <a href={`mailto:${developerEmail}`}>앱에 관해 궁금한 점이 있나요?<br /><span>메일 보내기 <MailOutlined /></span></a>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">HJ</span><span>Hwang Jimin</span></a>
        <p>© 2026 Hwang Jimin. All rights reserved.</p>
        <a href="#top" aria-label="맨 위로">TOP <ArrowUpOutlined /></a>
      </footer>
    </div>
  );
}

export default App;
