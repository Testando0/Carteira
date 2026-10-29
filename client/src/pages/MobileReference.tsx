import { useEffect, useState, type ReactNode } from "react";
import { calculateSalary } from "../lib/payroll";
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
  onCalculateTermination?: (contract: any, reason: string, discount: number, date: string) => any;
  onSignTermination: (contract: any) => void;
  onRegisterPayment: (payment: any) => void;
  onCreatePayment?: (payment: any) => void;
  onShareContract: (contract: any) => void;
  onPrintContract: (contract: any) => void;
  onLogout: () => void;
  onExportBackup: () => void;
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="ref-field"><span>{label}</span>{children}</label>
);

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
  onCalculateTermination,
  onSignTermination,
  onRegisterPayment,
  onCreatePayment,
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
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.querySelector<HTMLElement>(".ref-mobile-content")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [screen]);
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
    "salary-calc": "Cálculo de salário",
    overtime: "Horas trabalhadas",
    history: "Histórico",
    termination: "Rescisão",
    "termination-form": "Dados da rescisão",
    menu: "Menu",
    sync: "Sincronização",
    activity: "Atividades recentes",
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
      <div className="ref-quick-grid">
        <Card onClick={() => go("salary-calc")}><WalletCards /><b>Salário</b><span>Calcular pagamento</span></Card>
        <Card onClick={() => go("termination")}><FileText /><b>Rescisão</b><span>Calcular desligamento</span></Card>
        <Card onClick={() => go("history")}><Clock3 /><b>Histórico</b><span>Ver registros</span></Card>
      </div>
      <div className="ref-mobile-section-title"><span>atividades recentes</span><button onClick={() => go("activity")}>ver tudo</button></div>
      <div className="ref-list-card">
        {(data.audits || []).slice(0, 5).map((item: any) => <button className="ref-activity" key={item.id}><span className="ref-activity-icon"><Check size={15} /></span><span><b>{item.action}</b><small>{item.detail}</small></span><time>{item.when}</time><ChevronRight size={15} /></button>)}
        {!data.audits?.length && <div className="ref-empty">Nenhuma atividade registrada ainda.</div>}
      </div>
      <Card className="ref-punch-shortcut" onClick={() => go("time")}><Fingerprint /><span><b>Registrar ponto</b><small>Entrada, intervalo ou saída</small></span><ChevronRight /></Card>
    </>
  );

  const ActivityScreen = () => <><div className="ref-screen-intro"><span className="ref-screen-kicker">registro operacional</span><h2>Atividades recentes</h2><p>Histórico de alterações e eventos registrados na carteira.</p></div><div className="ref-list-card ref-activity-history">{(data.audits || []).map((item: any) => <div className="ref-activity-history-row" key={item.id}><span className={`ref-activity-icon ${item.tone || "green"}`}><Check size={15} /></span><span><b>{item.action}</b><small>{item.detail}</small></span><time>{item.when}</time></div>)}{!data.audits?.length && <div className="ref-empty">Nenhuma atividade registrada ainda.</div>}</div></>;
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

  const SalaryCalculator = () => {
    const [contractId, setContractId] = useState(contracts[0]?.id || "");
    const [days, setDays] = useState("15");
    const [bonus, setBonus] = useState("0");
    const [discount, setDiscount] = useState("0");
    const [result, setResult] = useState<any>(null);
    const contract = contracts.find((item: any) => item.id === contractId) || contracts[0];
    const calculate = () => { if (!contract) return; const value = calculateSalary(Number(contract.salary || 0), Number(days), Number(bonus), Number(discount)); setResult(value); if (!result && onCreatePayment && canManage) onCreatePayment({ id: `PAY-CALC-${Date.now()}`, worker: contract.worker, company: contract.company, amount: value.gross, date: "—", reference: `Cálculo ${new Date().toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })}`, status: "Pendente", discount: value.discount }); };
    return <><div className="ref-form-screen ref-calculator-screen"><div className="ref-screen-intro"><span className="ref-screen-kicker">folha inteligente</span><h2>Calcular salário</h2><p>Calcule o proporcional, adicionais, descontos e valor líquido antes de gerar o pagamento.</p></div><div className="ref-calculator-card"><div className="ref-mobile-section-title"><span>dados do contrato</span></div><label className="ref-field"><span>Contrato</span><select value={contractId} onChange={e => setContractId(e.target.value)}>{contracts.map((item: any) => <option key={item.id} value={item.id}>{item.worker} • {item.company}</option>)}</select></label>{contract && <div className="ref-calc-contract"><span>Empresa <b>{contract.company}</b></span><span>Cargo <b>{contract.role}</b></span><span>Salário mensal <b>{money(contract.salary)}</b></span></div>}<label className="ref-field"><span>Dias trabalhados no mês</span><input type="number" min="0" max="30" value={days} onChange={e => setDays(e.target.value)} /></label><div className="ref-calc-two"><label className="ref-field"><span>Bônus / verbas extras</span><input type="number" min="0" value={bonus} onChange={e => setBonus(e.target.value)} /></label><label className="ref-field"><span>Descontos</span><input type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)} /></label></div><button className="ref-primary ref-wide" onClick={calculate}><WalletCards size={17} /> Calcular salário</button></div>{result && <div className="ref-calculation-result"><div className="ref-mobile-section-title"><span>resultado</span></div><div><span>Saldo proporcional</span><b>{money(result.proportional)}</b></div><div><span>Total bruto</span><b>{money(result.gross)}</b></div><div className="ref-calculation-total"><span>Total líquido</span><b>{money(result.net)}</b></div><small>{canManage ? "Pagamento pendente criado no histórico." : "Cálculo simulado com os dados do contrato."}</small></div>}</div></>;
  };
  const Overtime = () => {
    const availableWorkers = canManage ? workers : workers.filter((worker: any) => worker.name === session.name);
    const [workerName, setWorkerName] = useState(availableWorkers[0]?.name || session.name);
    const workerPunches = (data.punches || []).filter((p: any) => p.worker === workerName && p.entry && p.exit);
    const [punchId, setPunchId] = useState("");
    const [hourValue, setHourValue] = useState("10");
    const [extraHours, setExtraHours] = useState("0");
    const [rate, setRate] = useState("50");
    const [result, setResult] = useState<any>(null);
    useEffect(() => { setPunchId(workerPunches[0]?.id || ""); setResult(null); }, [workerName, data.punches]);
    const selected = workerPunches.find((p: any) => p.id === punchId) || workerPunches[0];
    const minutes = (value: string) => { const [hours, mins] = value.split(":").map(Number); return hours * 60 + mins; };
    const workedHours = selected ? Math.max(0, minutes(selected.exit) - minutes(selected.entry) - (selected.breakStart && selected.breakEnd ? minutes(selected.breakEnd) - minutes(selected.breakStart) : 0)) / 60 : 0;
    const calculate = () => { if (!selected) return; const extra = Math.max(0, Number(extraHours) || 0); const value = extra * Math.max(0, Number(hourValue) || 0) * (1 + Math.max(0, Number(rate) || 0) / 100); setResult({ worked: workedHours, extra, value }); };
    return <div className="ref-calculator-screen ref-overtime-screen"><div className="ref-screen-intro"><span className="ref-screen-kicker">jornada e adicionais</span><h2>Horas trabalhadas</h2><p>Escolha o trabalhador, confira um registro encerrado e calcule as horas extras sem perder o contexto.</p></div><div className="ref-calculator-card"><div className="ref-mobile-section-title"><span>1 · selecionar trabalhador</span></div><label className="ref-field ref-select-field"><span>Pessoa</span><select className="ref-select-control" value={workerName} onChange={e => setWorkerName(e.target.value)} disabled={!canManage}>{availableWorkers.map((worker: any) => <option key={worker.id} value={worker.name}>{worker.name} • {worker.profession || "trabalhador"}</option>)}</select></label><div className="ref-mobile-section-title"><span>2 · registro de ponto</span></div><label className="ref-field ref-select-field"><span>Registro encerrado</span><select className="ref-select-control" value={selected?.id || ""} onChange={e => setPunchId(e.target.value)} disabled={!workerPunches.length}>{workerPunches.map((p: any) => <option key={p.id} value={p.id}>{p.date} • entrada {p.entry} – saída {p.exit}</option>)}</select></label>{selected && <div className="ref-calc-contract"><span>Trabalhador <b>{selected.worker}</b></span><span>Entrada <b>{selected.entry}</b></span><span>Saída <b>{selected.exit}</b></span><span>Total do dia <b>{workedHours.toFixed(2)}h</b></span></div>}<div className="ref-mobile-section-title"><span>3 · adicional</span></div><div className="ref-calc-two"><label className="ref-field"><span>Valor da hora</span><input type="number" min="0" value={hourValue} onChange={e => setHourValue(e.target.value)} /></label><label className="ref-field"><span>Horas extras</span><input type="number" min="0" step="0.25" value={extraHours} onChange={e => setExtraHours(e.target.value)} /></label></div><label className="ref-field ref-select-field"><span>Percentual adicional</span><select className="ref-select-control" value={rate} onChange={e => setRate(e.target.value)}><option value="50">50% — adicional padrão</option><option value="75">75% — adicional intermediário</option><option value="100">100% — adicional integral</option></select></label><button className="ref-primary ref-wide" onClick={calculate} disabled={!selected}><Clock3 size={17} /> Calcular hora extra</button></div>{result && <div className="ref-calculation-result"><div className="ref-mobile-section-title"><span>resultado do cálculo</span></div><div><span>Horas trabalhadas</span><b>{result.worked.toFixed(2)}h</b></div><div><span>Horas extras</span><b>{result.extra.toFixed(2)}h</b></div><div className="ref-calculation-total"><span>Total das horas extras</span><b>{money(result.value)}</b></div><small>Resultado calculado para {workerName}. Revise os valores antes de gerar o pagamento.</small></div>}{!workerPunches.length && <div className="ref-empty ref-empty-action">Nenhum ponto encerrado para {workerName}. Registre a saída no Controle de ponto antes de calcular.</div>}</div>;
  };
  const History = () => { const [filter, setFilter] = useState("all"); const items = [...(filter === "all" || filter === "payroll" ? payments.map((p: any) => ({ id: p.id, kind: "Salário calculado", detail: `${p.company} • ${p.reference}`, value: p.amount - p.discount, date: p.date, tone: "blue" })) : []), ...(filter === "all" || filter === "termination" ? contracts.filter((c: any) => c.status === "Encerrado").map((c: any) => ({ id: `term-${c.id}`, kind: "Rescisão concluída", detail: `${c.company} • ${c.terminationDate || "—"}`, value: c.netTerminationAmount || c.closingAmount || 0, date: c.terminationDate, tone: "green" })) : []), ...(filter === "all" || filter === "contracts" ? contracts.map((c: any) => ({ id: `contract-${c.id}`, kind: "Contrato", detail: `${c.worker} • ${c.company}`, value: c.salary, date: c.admitted, tone: "gold" })) : [])]; return <><div className="ref-screen-intro"><span className="ref-screen-kicker">linha do tempo</span><h2>Histórico</h2><p>Consulte salários, rescisões e contratos em um único lugar.</p></div><div className="ref-history-tabs">{[["all", "Tudo"], ["payroll", "Salários"], ["termination", "Rescisões"], ["contracts", "Contratos"]].map(([id, label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}</div><div className="ref-list-card ref-history-list">{items.map(item => <div className="ref-history-entry" key={item.id}><span className={`ref-activity-icon ${item.tone}`}><Check size={15} /></span><span><b>{item.kind}</b><small>{item.detail}</small><small>{item.date || "sem data"}</small></span><strong>{money(item.value)}</strong><ChevronRight size={15} /></div>)}{!items.length && <div className="ref-empty">Nenhum registro encontrado.</div>}</div></>; };
  const TerminationForm = () => {
    const c = selectedContract;
    const [reason, setReason] = useState("Desligamento do RPG");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [discount, setDiscount] = useState("0");
    if (!c) return <div className="ref-empty">Selecione um contrato para calcular a rescisão.</div>;
    const submit = () => { const value = Math.max(0, Number(discount) || 0); const result = onCalculateTermination ? onCalculateTermination(c, reason, value, date) : onCloseContract(c); if (result) { setSelectedContract({ ...c, ...result }); setScreen("termination"); } };
    return <div className="ref-termination-form"><div className="ref-screen-intro"><span className="ref-screen-kicker">desligamento guiado</span><h2>Rescisão de contrato</h2><p>Confira os dados, informe o motivo e revise os descontos antes de gerar a memória de cálculo.</p></div><div className="ref-contract-context"><div className="ref-contract-icon large"><FileText /></div><div><b>{c.worker}</b><span>{c.company} • {c.role}</span><strong>{money(c.salary)} / mês</strong></div></div><div className="ref-calculator-card"><div className="ref-mobile-section-title"><span>dados da rescisão</span></div><label className="ref-field"><span>Motivo do desligamento</span><select value={reason} onChange={e => setReason(e.target.value)}><option>Desligamento do RPG</option><option>Encerramento acordado</option><option>Pedido do trabalhador</option><option>Fim do contrato</option></select></label><label className="ref-field"><span>Data de saída</span><input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><div className="ref-mobile-section-title"><span>descontos e deduções</span></div><label className="ref-field"><span>Valor dos descontos (R$)</span><input type="number" min="0" step="0.01" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0,00" /></label><div className="ref-form-note"><Check size={16} /><span>O sistema calculará saldo de salário, férias proporcionais, 13º proporcional, multa RP e valor líquido.</span></div><button className="ref-primary ref-wide" onClick={submit}><WalletCards size={17} /> Calcular rescisão</button></div></div>;
  };
  const Termination = () => { const c = selectedContract; const salaryBalance = c?.salaryBalance ?? c?.closingAmount ?? 0; const vacation = c?.vacationProportional ?? 0; const thirteenth = c?.thirteenthProportional ?? 0; const fgts = c?.fgtsFine ?? 0; const discounts = c?.terminationDiscounts ?? 0; const net = c?.netTerminationAmount ?? c?.closingAmount ?? 0; if (!c) return <><div className="ref-screen-intro"><span className="ref-screen-kicker">rescisão e desligamento</span><h2>Escolha o vínculo</h2><p>Selecione um contrato ativo para preencher os dados e gerar o cálculo líquido.</p></div><div className="ref-list-card">{contracts.map((item: any) => <div className="ref-termination-choice" key={item.id}><span className="ref-contract-icon"><FileText /></span><span><b>{item.worker}</b><small>{item.company} • {item.role} • {money(item.salary)}</small></span><button className={item.status === "Ativo" ? "ref-secondary-action" : "ref-primary ref-mini-action"} onClick={() => { setSelectedContract(item); setScreen(item.status === "Ativo" ? "termination-form" : "termination"); }}>{item.status === "Ativo" ? "Calcular" : "Ver cálculo"}</button></div>)}{!contracts.length && <div className="ref-empty">Nenhum contrato disponível para rescisão.</div>}</div></>; return <div className="ref-termination-result"><div className="ref-screen-intro"><span className="ref-screen-kicker">resultado calculado</span><h2>Resultado da rescisão</h2><p>{c.worker} • {c.company} • {c.terminationDate || "data pendente"}</p></div><div className="ref-termination-card"><div className="ref-termination-brand"><span className="ref-contract-icon large"><FileText /></span><div><b>Resumo dos valores</b><small>{c.terminationReason || "Desligamento do RPG"}</small></div></div><div><span>Saldo de salário</span><b>{money(salaryBalance)}</b></div><div><span>Férias proporcionais</span><b>{money(vacation)}</b></div><div><span>13º proporcional</span><b>{money(thirteenth)}</b></div><div><span>Multa RP</span><b>{money(fgts)}</b></div><div><span>Total bruto</span><b>{money(salaryBalance + vacation + thirteenth + fgts)}</b></div><div><span>Descontos</span><b>- {money(discounts)}</b></div><div className="ref-termination-total"><span>Total líquido</span><b>{money(net)}</b></div></div><div className="ref-term-actions"><button className="ref-secondary-action ref-wide" onClick={() => onPrintContract(c)}><FileText size={16} /> Visualizar termo</button><button className="ref-primary ref-wide" onClick={() => onSignTermination(c)}><Check size={17} /> Assinar encerramento</button><button className="ref-secondary-action ref-wide" onClick={() => { setSelectedContract(c); setScreen("termination-form"); }}>Editar cálculo</button><button className="ref-secondary-action ref-wide" onClick={() => { setSelectedContract(null); setScreen("contracts"); }}>Concluir e voltar aos contratos</button></div></div>; };
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

  const MenuScreen = () => <><div className="ref-menu-profile"><div className="ref-avatar">{session.name?.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}</div><div><b>{session.name}</b><small>{session.role}</small></div></div>{[[Home,"Início","home"],[UsersRound,"Trabalhadores","workers"],[Building2,"Empresas","companies"],[FileText,"Contratos","contracts"],[Clock3,"Ponto","time"],[WalletCards,"Salários","payroll"],[WalletCards,"Calcular salário","salary-calc"],[Clock3,"Horas extras","overtime"],[FileText,"Histórico","history"],[FileText,"Rescisão","termination"],[UserRound,"Meu perfil","profile"],[Settings2,"Temas","themes"],[ShieldCheck,"Sincronização","sync"],[Smartphone,"Android","android"]].map(([Icon,label,next]: any) => <button className="ref-menu-row" key={next} onClick={() => go(next)}><Icon size={19}/><span>{label}</span><ChevronRight size={16}/></button>)}<button className="ref-menu-row danger" onClick={onLogout}><LogOut size={19}/><span>Sair</span></button></>;

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
    if (screen === "salary-calc") return <SalaryCalculator />;
    if (screen === "overtime") return <Overtime />;
    if (screen === "history") return <History />;
    if (screen === "termination") return <Termination />;
    if (screen === "termination-form") return <TerminationForm />;
    if (screen === "new-worker") return NewWorker();
    if (screen === "new-company") return NewCompany();
    if (screen === "new-contract") return NewContract();
    if (screen === "signature") return <Signature />;
    if (screen === "menu") return <MenuScreen />;
    if (screen === "sync") return <Sync />;
    if (screen === "activity") return <ActivityScreen />;
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
