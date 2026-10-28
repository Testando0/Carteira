import { useEffect, useState } from "react";
import { THEME_OPTIONS, useTheme } from "../contexts/ThemeContext";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  Fingerprint,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings2,
  ShieldCheck,
  Smartphone,
  UserRound,
  UsersRound,
  WalletCards,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

type Props = {
  data: any;
  session: any;
  online: boolean;
  canManage: boolean;
  isAdmin: boolean;
  isWorker: boolean;
  myContracts: any[];
  signedContracts: any[];
  pending: number;
  onPunch: () => void;
  onPausePunch: () => void;
  onClosePunch: () => void;
  onOpenAdd: (tab: string) => void;
  workerForm: any;
  setWorkerForm: (value: any) => void;
  companyForm: any;
  setCompanyForm: (value: any) => void;
  contractForm: any;
  setContractForm: (value: any) => void;
  onAddWorker: () => void;
  onAddCompany: () => void;
  onAddContract: () => void;
  onSignContract: (contract: any) => void;
  onCloseContract: (contract: any) => any;
  onSignTermination: (contract: any) => void;
  onRegisterPayment: (payment: any) => void;
  onShareContract: (contract: any) => void;
  onPrintContract: (contract: any) => void;
  onLogout: () => void;
  onExportBackup: () => void;
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function MobileReference({
  data,
  session,
  online,
  canManage,
  isAdmin,
  isWorker,
  myContracts,
  signedContracts,
  pending,
  onPunch,
  onPausePunch,
  onClosePunch,
  onOpenAdd,
  workerForm,
  setWorkerForm,
  companyForm,
  setCompanyForm,
  contractForm,
  setContractForm,
  onAddWorker,
  onAddCompany,
  onAddContract,
  onSignContract,
  onCloseContract,
  onSignTermination,
  onRegisterPayment,
  onShareContract,
  onPrintContract,
  onLogout,
  onExportBackup,
}: Props) {
  const [screen, setScreen] = useState("home");
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [drawer, setDrawer] = useState(false);
  const workers = data.workers || [];
  const companies = data.companies || [];
  const contracts = isWorker ? myContracts : data.contracts || [];
  const payments = isWorker
    ? (data.payments || []).filter((p: any) => p.worker === session.name)
    : data.payments || [];

  const openWorker = (worker: any) => {
    setSelectedWorker(worker);
    setScreen("worker");
  };
  const openCompany = (company: any) => {
    setSelectedCompany(company);
    setScreen("company");
  };
  const openContract = (contract: any) => {
    setSelectedContract(contract);
    setScreen("contract");
  };
  const startNew = (kind: string) => {
    onOpenAdd(kind);
    setScreen(kind === "workers" ? "new-worker" : kind === "companies" ? "new-company" : "new-contract");
  };
  const go = (next: string) => {
    setDrawer(false);
    setScreen(next);
  };

  const title: Record<string, string> = {
    home: "Painel inicial",
    workers: "Trabalhadores",
    worker: "Carteira profissional",
    companies: "Empresas",
    company: "Empresa",
    contracts: "Contratos",
    contract: "Contrato de trabalho",
    time: "Ponto",
    payroll: "Salários",
    termination: "Rescisão",
    menu: "Menu",
    sync: "Sincronização",
    android: "Carteira no Android",
    "new-worker": "Novo trabalhador",
    "new-company": "Nova empresa",
    "new-contract": "Novo contrato",
    signature: "Assinatura de contrato",
    profile: "Meu perfil",
  };

  const Header = ({ back = false }: { back?: boolean }) => (
    <header className="ref-mobile-header">
      <button
        className="ref-mobile-icon"
        aria-label={back ? "Voltar" : "Abrir menu"}
        onClick={() => (back ? setScreen("home") : setDrawer(true))}
      >
        {back ? <ArrowLeft size={20} /> : <Menu size={20} />}
      </button>
      <div className="ref-mobile-title">{title[screen]}</div>
      <div className="ref-mobile-status"><span /> {online ? "online" : "local"}</div>
    </header>
  );

  const Card = ({ children, onClick, className = "" }: any) => (
    <button className={`ref-card ${className}`} onClick={onClick}>
      {children}
    </button>
  );

  const Dashboard = () => (
    <>
      <div className="ref-greeting">
        <button className="ref-avatar ref-avatar-button" onClick={() => go("profile")}>{session.name?.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}</button>
        <div><span>Olá, {session.name?.split(" ")[0]}</span><small>Bem-vindo(a) ao seu painel</small></div>
        <span className="ref-bell">♧</span>
      </div>
      <div className="ref-mobile-section-title"><span>visão geral</span><b>Hoje</b></div>
      <div className="ref-stats-grid">
        <Card onClick={() => go("workers")}><UsersRound /><b>{workers.length}</b><span>Trabalhadores</span></Card>
        <Card onClick={() => go("companies")}><Building2 /><b>{companies.length}</b><span>Empresas</span></Card>
        <Card onClick={() => go("contracts")}><FileText /><b>{contracts.length}</b><span>Contratos ativos</span></Card>
        <Card onClick={() => go("payroll")}><WalletCards /><b>{money(pending)}</b><span>Salários pendentes</span></Card>
      </div>
      <div className="ref-mobile-section-title"><span>atividades recentes</span><button onClick={() => go("sync")}>ver tudo</button></div>
      <div className="ref-list-card">
        {(data.audits || []).slice(0, 5).map((item: any) => <button className="ref-activity" key={item.id}><span className="ref-activity-icon"><Check size={15} /></span><span><b>{item.action}</b><small>{item.detail}</small></span><time>{item.when}</time><ChevronRight size={15} /></button>)}
        {!data.audits?.length && <div className="ref-empty">Nenhuma atividade registrada ainda.</div>}
      </div>
      <Card className="ref-punch-shortcut" onClick={() => go("time")}><Fingerprint /><span><b>Registrar ponto</b><small>Entrada, intervalo ou saída</small></span><ChevronRight /></Card>
    </>
  );

  const Workers = () => (
    <>
      <div className="ref-search">⌕ <input placeholder="Buscar por nome, ID ou empresa..." /></div>
      {canManage && <button className="ref-primary ref-wide" onClick={() => startNew("workers")}><Plus size={17} /> Novo trabalhador</button>}
      <div className="ref-list-card">{workers.map((worker: any) => <Card key={worker.id} className="ref-person-row" onClick={() => openWorker(worker)}><span className="ref-person-avatar">{worker.name?.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}</span><span><b>{worker.name}</b><small>ID: {worker.id} | {worker.profession}</small><small>{worker.company}</small></span><em>{worker.status}</em><ChevronRight /></Card>)}</div>
    </>
  );

  const WorkerDetail = () => selectedWorker && (
    <>
      <div className="ref-profile-head"><div className="ref-profile-photo">{selectedWorker.name?.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}</div><div><h2>{selectedWorker.name}</h2><span>ID: {selectedWorker.id}</span></div><em>{selectedWorker.status}</em></div>
      <div className="ref-detail-grid"><div><small>Profissão</small><b>{selectedWorker.profession}</b></div><div><small>Telefone</small><b>{selectedWorker.phone || "Não informado"}</b></div><div><small>Empresa atual</small><b>{selectedWorker.company}</b></div><div><small>Status</small><b>{selectedWorker.status}</b></div></div>
      <div className="ref-action-grid"><Card onClick={() => go("contracts")}><FileText /><span>Contratos</span></Card><Card onClick={() => go("time")}><Clock3 /><span>Ponto</span></Card><Card onClick={() => go("payroll")}><WalletCards /><span>Salários</span></Card></div>
      <div className="ref-mobile-section-title"><span>histórico profissional</span></div><div className="ref-list-card">{contracts.filter((c: any) => c.worker === selectedWorker.name).map((c: any) => <Card key={c.id} className="ref-history-row" onClick={() => openContract(c)}><span><b>{c.company}</b><small>{c.role} • {c.admitted}</small></span><em>{c.status}</em><ChevronRight /></Card>)}</div>
    </>
  );

  const Companies = () => <><div className="ref-search">⌕ <input placeholder="Buscar empresa..." /></div>{canManage && <button className="ref-primary ref-wide" onClick={() => startNew("companies")}><Plus size={17} /> Nova empresa</button>}<div className="ref-list-card">{companies.map((company: any) => <Card key={company.id} className="ref-company-row" onClick={() => openCompany(company)}><span className="ref-company-icon"><Building2 /></span><span><b>{company.name}</b><small>{company.type}</small><small>{company.location || "Local não informado"}</small></span><ChevronRight /></Card>)}</div></>;

  const CompanyDetail = () => selectedCompany && <><div className="ref-company-hero"><span className="ref-company-icon large"><Building2 /></span><h2>{selectedCompany.name}</h2><span>{selectedCompany.type} • {selectedCompany.location || "local não informado"}</span></div><div className="ref-detail-grid"><div><small>Responsável</small><b>{selectedCompany.owner}</b></div><div><small>Funcionários ativos</small><b>{contracts.filter((c: any) => c.company === selectedCompany.name && c.status === "Ativo").length}</b></div></div><div className="ref-mobile-section-title"><span>contratos da empresa</span></div><div className="ref-list-card">{contracts.filter((c: any) => c.company === selectedCompany.name).map((c: any) => <Card key={c.id} className="ref-history-row" onClick={() => openContract(c)}><span><b>{c.worker}</b><small>{c.role} • {money(c.salary)}</small></span><em>{c.status}</em><ChevronRight /></Card>)}</div></>;

  const Contracts = () => <><div className="ref-mobile-section-title"><span>{isWorker ? "meus contratos" : "contratos ativos"}</span><b>{contracts.length}</b></div>{canManage && <button className="ref-primary ref-wide" onClick={() => startNew("contracts")}><Plus size={17} /> Novo contrato</button>}<div className="ref-list-card">{contracts.map((c: any) => <Card key={c.id} className="ref-contract-row" onClick={() => openContract(c)}><span className="ref-contract-icon"><FileText /></span><span><b>{c.role}</b><small>{c.worker} • {c.company}</small><small>{money(c.salary)} • {c.schedule}</small></span><em className={c.workerSigned ? "ok" : "pending"}>{c.workerSigned ? "Assinado" : "Pendente"}</em><ChevronRight /></Card>)}</div></>;

  const ContractDetail = () => selectedContract && <><div className="ref-contract-document"><span className="ref-contract-icon large"><FileText /></span><h2>Contrato de trabalho</h2><span>{selectedContract.id}</span><hr/><div><small>Trabalhador</small><b>{selectedContract.worker}</b></div><div><small>Empresa</small><b>{selectedContract.company}</b></div><div><small>Cargo e salário</small><b>{selectedContract.role} • {money(selectedContract.salary)}</b></div><div><small>Jornada</small><b>{selectedContract.schedule}</b></div><div><small>Admissão</small><b>{selectedContract.admitted}</b></div></div><div className="ref-action-grid"><Card onClick={() => onPrintContract(selectedContract)}><FileText /><span>Ver contrato</span></Card><Card onClick={() => setScreen("signature")}><Check /><span>Assinar</span></Card><Card onClick={() => onShareContract(selectedContract)}><FileCheck2 /><span>Enviar link</span></Card></div>{canManage && selectedContract.status === "Ativo" && <button className="ref-danger ref-wide" onClick={() => { const breakdown = onCloseContract(selectedContract); if (breakdown) setSelectedContract({ ...selectedContract, ...breakdown }); go("termination"); }}>Calcular rescisão</button>}{selectedContract.status === "Encerrado" && <button className="ref-primary ref-wide" onClick={() => go("termination")}>Ver cálculo da rescisão</button>}</>;

  const Time = () => {
    const [clock, setClock] = useState(Date.now());
    useEffect(() => { const timer = window.setInterval(() => setClock(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
    const openPunch = (data.punches || []).find((p: any) => p.worker === session.name && p.date === "Hoje" && !p.exit);
    const paused = Boolean(openPunch?.breakStart && !openPunch?.breakEnd);
    const minutesFrom = (value?: string) => { if (!value) return 0; const [h, m] = value.split(":").map(Number); return h * 60 + m; };
    const elapsed = (p: any) => { if (!p?.entry) return "00h 00m"; const current = new Date(clock); const start = minutesFrom(p.entry); const nowMinutes = current.getHours() * 60 + current.getMinutes(); let worked = Math.max(0, nowMinutes - start); if (p.breakStart) { const pauseStart = minutesFrom(p.breakStart); const pauseEnd = p.breakEnd ? minutesFrom(p.breakEnd) : nowMinutes; worked = Math.max(0, worked - Math.max(0, pauseEnd - pauseStart)); } return `${String(Math.floor(worked / 60)).padStart(2, "0")}h ${String(worked % 60).padStart(2, "0")}m`; };
    return <><div className="ref-time-head"><span>{new Date(clock).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span><small>{new Date(clock).toLocaleDateString("pt-BR")}</small></div>{openPunch ? <div className={`ref-open-punch ${paused ? "is-paused" : ""}`}><div><b>{paused ? "Ponto pausado" : "Jornada em andamento"}</b><span>Entrada às {openPunch.entry}{openPunch.breakStart ? ` • pausa ${openPunch.breakStart}${openPunch.breakEnd ? `–${openPunch.breakEnd}` : ""}` : ""}</span></div><strong>{elapsed(openPunch)}</strong><small>{paused ? "O contador está parado. Retome para continuar." : "Tempo trabalhado nesta jornada"}</small></div> : <div className="ref-time-empty"><Clock3 size={20} /><span>Nenhuma jornada iniciada hoje</span></div>}{openPunch ? <div className="ref-time-actions"><button className="ref-secondary-action" onClick={onPausePunch}>{paused ? "Retomar ponto" : "Pausar ponto"}</button><button className="ref-finish-action" onClick={onClosePunch}><Check size={16} /> Encerrar jornada</button></div> : <button className="ref-punch-button" onClick={onPunch}><span><Fingerprint size={58} /></span><b>Iniciar ponto</b><small>marcar horário de entrada</small></button>}<div className="ref-mobile-section-title"><span>Registros de hoje</span></div><div className="ref-list-card">{(data.punches || []).filter((p: any) => !isWorker || p.worker === session.name).slice(0, 8).map((p: any) => <div className="ref-punch-row" key={p.id}><span className="ref-punch-dot"><Clock3 size={15} /></span><span><b>{p.worker}</b><small>{p.date} • entrada {p.entry || "—"}</small></span><strong>{p.exit ? `entrada ${p.entry} • saída ${p.exit}` : p.entry ? (p.breakStart && !p.breakEnd ? "pausado" : "em andamento") : "—"}</strong></div>)}{!(data.punches || []).length && <div className="ref-empty">Nenhum registro de ponto ainda.</div>}</div></>;
  };
  const Payroll = () => <><div className="ref-money-card"><small>total recebido</small><strong>{money(payments.filter((p: any) => p.status === "Pago").reduce((sum: number, p: any) => sum + p.amount - p.discount, 0))}</strong><span>valores líquidos pagos</span></div><div className="ref-mobile-section-title"><span>holerites e pendências</span></div><div className="ref-list-card">{payments.map((p: any) => <Card key={p.id} className="ref-pay-row" onClick={() => p.status === "Pendente" && canManage && onRegisterPayment(p)}><span className="ref-pay-icon"><WalletCards /></span><span><b>{p.reference}</b><small>{p.worker} • {p.company}</small><small>Desconto: {money(p.discount)}</small></span><strong>{money(p.amount - p.discount)}</strong><em className={p.status === "Pago" ? "ok" : "pending"}>{p.status}</em></Card>)}</div></>;

  const Termination = () => { const c = selectedContract; const salaryBalance = c?.salaryBalance ?? c?.closingAmount ?? 0; const vacation = c?.vacationProportional ?? 0; const thirteenth = c?.thirteenthProportional ?? 0; const fgts = c?.fgtsFine ?? 0; const discounts = c?.terminationDiscounts ?? 0; const net = c?.netTerminationAmount ?? c?.closingAmount ?? 0; if (!c) return <><div className="ref-mobile-section-title"><span>rescisão e desligamento</span><b>{contracts.length}</b></div><p className="ref-screen-description">Selecione um vínculo para calcular o valor líquido da rescisão ou consultar um cálculo já realizado.</p><div className="ref-list-card">{contracts.map((item: any) => <div className="ref-termination-choice" key={item.id}><span className="ref-contract-icon"><FileText /></span><span><b>{item.worker}</b><small>{item.company} • {item.role} • {money(item.salary)}</small></span><button className={item.status === "Ativo" ? "ref-secondary-action" : "ref-primary ref-mini-action"} onClick={() => { if (item.status === "Ativo") { if (!canManage) return; const breakdown = onCloseContract(item); if (breakdown) setSelectedContract({ ...item, ...breakdown }); } else setSelectedContract(item); }}>{item.status === "Ativo" ? "Calcular" : "Ver cálculo"}</button></div>)}{!contracts.length && <div className="ref-empty">Nenhum contrato disponível para rescisão.</div>}</div></>; return <><div className="ref-termination-card"><span className="ref-contract-icon large"><FileText /></span><h2>{c.worker || "Rescisão e desligamento"}</h2><small>Memória de cálculo • estimativa do servidor RPG</small><div><span>Saldo de salário</span><b>{money(salaryBalance)}</b></div><div><span>Férias proporcionais</span><b>{money(vacation)}</b></div><div><span>13º proporcional</span><b>{money(thirteenth)}</b></div><div><span>Multa FGTS (40%)</span><b>{money(fgts)}</b></div><div><span>Descontos</span><b>- {money(discounts)}</b></div><div className="ref-termination-total"><span>Valor líquido a pagar</span><b>{money(net)}</b></div><small>Desligamento: {c.terminationDate || "pendente"} • Motivo: {c.terminationReason || "Encerramento acordado"}</small></div><button className="ref-secondary-action ref-wide" onClick={() => setSelectedContract(null)}>Voltar para vínculos</button><button className="ref-primary ref-wide" onClick={() => onSignTermination(c)}><Check size={17} /> Assinar encerramento</button></>; };
  const Field = ({ label, children }: any) => <label className="ref-field"><span>{label}</span>{children}</label>;
  const NewWorker = () => <div className="ref-form-screen"><div className="ref-form-grid"><Field label="Nome completo"><input value={workerForm.name} onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })} placeholder="Ex.: João Silva" /></Field><Field label="ID do trabalhador"><input value={workerForm.id} onChange={e => setWorkerForm({ ...workerForm, id: e.target.value })} placeholder="001234" /></Field><Field label="Telefone"><input value={workerForm.phone} onChange={e => setWorkerForm({ ...workerForm, phone: e.target.value })} placeholder="(11) 98765-4321" /></Field><Field label="Profissão"><input value={workerForm.profession} onChange={e => setWorkerForm({ ...workerForm, profession: e.target.value })} placeholder="Ex.: Garçom" /></Field><Field label="Usuário"><input value={workerForm.username} onChange={e => setWorkerForm({ ...workerForm, username: e.target.value })} placeholder="joao.silva" /></Field><Field label="Senha"><input type="password" value={workerForm.password} onChange={e => setWorkerForm({ ...workerForm, password: e.target.value })} placeholder="mínimo 4 caracteres" /></Field><Field label="Confirmar senha"><input type="password" value={workerForm.passwordConfirm} onChange={e => setWorkerForm({ ...workerForm, passwordConfirm: e.target.value })} /></Field></div><button className="ref-primary ref-wide" onClick={onAddWorker}><Check size={17} /> Salvar trabalhador</button></div>;
  const NewCompany = () => <div className="ref-form-screen"><div className="ref-form-grid"><Field label="Nome da empresa"><input value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} placeholder="Bar do Centro" /></Field><Field label="Categoria"><select value={companyForm.type} onChange={e => setCompanyForm({ ...companyForm, type: e.target.value })}><option>Bar</option><option>Loja</option><option>Restaurante</option><option>Oficina</option><option>Segurança</option></select></Field><Field label="Responsável"><input value={companyForm.owner} onChange={e => setCompanyForm({ ...companyForm, owner: e.target.value })} placeholder="Nome do responsável" /></Field><Field label="Localização"><input value={companyForm.location} onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })} placeholder="Bairro • Cidade" /></Field></div><button className="ref-primary ref-wide" onClick={onAddCompany}><Check size={17} /> Salvar empresa</button></div>;
  const NewContract = () => <div className="ref-form-screen"><div className="ref-form-grid"><Field label="Trabalhador"><select value={contractForm.worker} onChange={e => setContractForm({ ...contractForm, worker: e.target.value })}>{workers.map((w: any) => <option key={w.id}>{w.name}</option>)}</select></Field><Field label="Empresa"><select value={contractForm.company} onChange={e => setContractForm({ ...contractForm, company: e.target.value })}>{companies.map((c: any) => <option key={c.id}>{c.name}</option>)}</select></Field><Field label="Cargo"><input value={contractForm.role} onChange={e => setContractForm({ ...contractForm, role: e.target.value })} placeholder="Garçom" /></Field><Field label="Salário mensal"><input type="number" value={contractForm.salary} onChange={e => setContractForm({ ...contractForm, salary: e.target.value })} placeholder="1800" /></Field><Field label="Jornada"><input value={contractForm.schedule} onChange={e => setContractForm({ ...contractForm, schedule: e.target.value })} placeholder="08h às 17h" /></Field><Field label="Admissão"><input type="date" value={contractForm.admitted} onChange={e => setContractForm({ ...contractForm, admitted: e.target.value })} /></Field></div><button className="ref-primary ref-wide" onClick={onAddContract}><FileCheck2 size={17} /> Criar contrato</button></div>;
  const Signature = () => selectedContract && <div className="ref-signature-screen"><FileText size={54} /><h2>Assinatura de contrato</h2><p>Você está prestes a assinar o contrato de trabalho de <b>{selectedContract.worker}</b>.</p><div className="ref-check-box"><span>✓</span> Li e concordo com os termos do contrato</div><div className="ref-check-box"><span>✓</span> Desejo fazer a assinatura digital</div><button className="ref-primary ref-wide" onClick={() => { onSignContract(selectedContract); setScreen("contract"); }}><Check size={17} /> Assinar contrato</button></div>;

  const Themes = () => {
    const { theme, setTheme } = useTheme();
    return <div className="ref-themes-screen"><div className="ref-mobile-section-title"><span>personalização visual</span><b>{THEME_OPTIONS.find(option => option.id === theme)?.label}</b></div><p>Escolha o tema da Carteira. A preferência fica salva neste dispositivo.</p><div className="ref-theme-list">{THEME_OPTIONS.map(option => <button key={option.id} className={`ref-theme-option ${theme === option.id ? "selected" : ""}`} onClick={() => setTheme(option.id)}><span className={`ref-theme-swatch theme-${option.id}`} /><span><b>{option.label}</b><small>{option.description}</small></span>{theme === option.id && <Check size={17} />}</button>)}</div></div>;
  };
  const Profile = () => {
    const myPayments = payments.length;
    const myPunches = (data.punches || []).filter((p: any) => !isWorker || p.worker === session.name).length;
    return <>
      <div className="ref-profile-head"><div className="ref-profile-photo">{session.name?.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}</div><div><h2>{session.name}</h2><span>@{session.username}</span></div><em>Ativo</em></div>
      <div className="ref-profile-role"><UserRound size={17} /><span><small>Perfil de acesso</small><b>{session.role}</b></span></div>
      <div className="ref-detail-grid"><div><small>Contratos registrados</small><b>{myContracts.length}</b></div><div><small>Pagamentos vinculados</small><b>{myPayments}</b></div><div><small>Ponto registrado</small><b>{myPunches}</b></div><div><small>Conexão</small><b>{online ? "Online" : "Local"}</b></div></div>
      <div className="ref-mobile-section-title"><span>meus vínculos</span></div>
      <div className="ref-list-card">{myContracts.map((c: any) => <Card key={c.id} className="ref-history-row" onClick={() => openContract(c)}><span><b>{c.company}</b><small>{c.role} • {money(c.salary)}</small></span><em>{c.status}</em><ChevronRight /></Card>)}{!myContracts.length && <div className="ref-empty">Você ainda não possui contratos registrados.</div>}</div>
      <button className="ref-danger ref-wide" onClick={onLogout}><LogOut size={16} /> Sair da conta</button>
    </>;
  };

  const MenuScreen = () => <><div className="ref-menu-profile"><div className="ref-avatar">{session.name?.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}</div><div><b>{session.name}</b><small>{session.role}</small></div></div>{[[Home,"Início","home"],[UsersRound,"Trabalhadores","workers"],[Building2,"Empresas","companies"],[FileText,"Contratos","contracts"],[Clock3,"Ponto","time"],[WalletCards,"Salários","payroll"],[FileText,"Rescisão","termination"],[UserRound,"Meu perfil","profile"],[Settings2,"Temas","themes"],[ShieldCheck,"Sincronização","sync"],[Smartphone,"Android","android"]].map(([Icon,label,next]: any) => <button className="ref-menu-row" key={next} onClick={() => go(next)}><Icon size={19}/><span>{label}</span><ChevronRight size={16}/></button>)}<button className="ref-menu-row danger" onClick={onLogout}><LogOut size={19}/><span>Sair</span></button></>;

  const Sync = () => <div className="ref-center-screen"><Wifi size={52}/><h2>Dados sincronizados</h2><p>Seus registros estão seguros e disponíveis em todos os seus dispositivos.</p><div className="ref-sync-status"><span><Check size={15}/></span>{online ? "Conectado • banco de dados online" : "Modo local • aguardando conexão"}</div><button className="ref-primary ref-wide" onClick={onExportBackup}><ShieldCheck size={17}/> Exportar backup</button></div>;
  const Android = () => <div className="ref-center-screen"><Smartphone size={58}/><h2>Disponível para Android</h2><p>Instale a Carteira RP no celular para acessar ponto, contratos e holerites.</p><div className="ref-checks"><span><Check /> APK instalável</span><span><Check /> Funciona offline e online</span><span><Check /> Compartilhamento entre celulares</span><span><Check /> Seguro e criptografado</span></div><button className="ref-primary ref-wide" onClick={() => alert("A versão Android será disponibilizada em breve.")}>Instalar</button></div>;

  const render = () => {
    if (screen === "home") return <Dashboard />;
    if (screen === "workers") return <Workers />;
    if (screen === "worker") return <WorkerDetail />;
    if (screen === "companies") return <Companies />;
    if (screen === "company") return <CompanyDetail />;
    if (screen === "contracts") return <Contracts />;
    if (screen === "contract") return <ContractDetail />;
    if (screen === "time") return <Time />;
    if (screen === "payroll") return <Payroll />;
    if (screen === "termination") return <Termination />;
    if (screen === "new-worker") return <NewWorker />;
    if (screen === "new-company") return <NewCompany />;
    if (screen === "new-contract") return <NewContract />;
    if (screen === "signature") return <Signature />;
    if (screen === "menu") return <MenuScreen />;
    if (screen === "sync") return <Sync />;
    if (screen === "android") return <Android />;
    if (screen === "profile") return <Profile />;
    if (screen === "themes") return <Themes />;
    return <Dashboard />;
  };

  return <div className="ref-mobile-app">
    <Header back={screen !== "home" && screen !== "menu"} />
    <main className="ref-mobile-content">{render()}</main>
    <nav className="ref-bottom-nav"><button className={screen === "home" ? "active" : ""} onClick={() => go("home")}><Home/><span>Início</span></button><button className={screen === "workers" || screen === "worker" ? "active" : ""} onClick={() => go("workers")}><UsersRound/><span>Trabalhadores</span></button><button className={screen === "companies" || screen === "company" ? "active" : ""} onClick={() => go("companies")}><Building2/><span>Empresas</span></button><button className={screen === "menu" ? "active" : ""} onClick={() => go("menu")}><Menu/><span>Mais</span></button></nav>
    {drawer && <div className="ref-drawer-backdrop" onClick={() => setDrawer(false)}><aside className="ref-drawer" onClick={e => e.stopPropagation()}><div className="ref-drawer-head"><b>CARTEIRA <span>RP</span></b><button onClick={() => setDrawer(false)}><X/></button></div><MenuScreen /></aside></div>}
  </div>;
}
