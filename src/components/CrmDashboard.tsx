import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  X,
  Play,
  Send,
  DollarSign,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  Phone,
  Instagram,
  Mail,
  Clock,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Share2,
  Copy,
  Check,
  Shield,
  Lock,
  PiggyBank,
  Receipt,
} from "lucide-react";
import { Prospect } from "@/lib/types";
import { db, doc, setDoc, onSnapshot } from "@/lib/firebase";

interface CrmDashboardProps {
  prospects: Prospect[];
  selectedProspectId: string | null;
  onClearSelection: () => void;
  onAddProspect: (prospect: Omit<Prospect, "id" | "createdAt">) => void;
  onUpdateStatus: (id: string, status: Prospect["status"]) => void;
  onUpdateProspect?: (id: string, updatedFields: Partial<Prospect>) => void;
  onDeleteProspect: (id: string) => void;
  currentTierName: string;
  currentUser?: any;
  readonlyMode?: boolean;
  onBackToSharedList?: () => void;
}

interface SimulatedLead {
  id: string;
  name: string;
  channel: "whatsapp" | "instagram" | "phone" | "email";
  status: "nuevo" | "templado" | "caliente" | "cerrado" | "humano" | "frio";
  latestMessage: string;
  lastActive: string;
  timestamp: number;
  productOfInterest?: string;
  phoneOrUser: string;
}

const WhatsAppIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 660 705"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0 C0.88783173 0.00126892 1.77566345 0.00253784 2.69039917 0.00384521 C55.30707195 0.14704238 102.67127113 13.86688153 149.625 37.1875 C150.68799316 37.70586426 151.75098633 38.22422852 152.84619141 38.75830078 C158.41488393 41.49189638 163.76266013 44.29571693 168.875 47.8125 C169.49213867 48.23072021 170.10927734 48.64894043 170.74511719 49.07983398 C196.8552971 66.96248486 222.16406133 88.08170488 241.625 113.1875 C242.25019531 113.94546875 242.87539063 114.7034375 243.51953125 115.484375 C253.27758045 127.32917607 261.91767667 140.04119326 269.55712891 153.34130859 C270.61669751 155.17314622 271.70248162 156.98721652 272.79296875 158.80078125 C288.72278028 185.67968324 299.54084695 216.59207009 305.625 247.1875 C305.80756348 248.09483887 305.99012695 249.00217773 306.17822266 249.93701172 C319.07315777 315.33355711 311.77009426 387.77224325 280.625 447.1875 C279.97617849 448.50310117 279.33181868 449.82090999 278.69140625 451.140625 C274.47436084 459.81577853 269.88302287 468.08855545 264.625 476.1875 C264.19735352 476.85475098 263.76970703 477.52200195 263.32910156 478.20947266 C251.95783993 495.90835588 239.3170279 512.13148896 224.625 527.1875 C223.95033691 527.88794434 223.27567383 528.58838867 222.58056641 529.31005859 C214.43072218 537.75973613 206.21266625 545.72506786 196.81640625 552.77734375 C193.85302096 555.01529812 191.02061967 557.35081913 188.1875 559.75 C170.41380372 574.28744522 149.45660257 586.1971121 128.46435547 595.37890625 C126.73881168 596.13746758 125.02700695 596.92706703 123.31640625 597.71875 C97.55635533 609.34633601 69.51147783 616.1437838 41.625 620.1875 C40.82755371 620.30609375 40.03010742 620.4246875 39.20849609 620.546875 C11.6157424 624.44641874 -17.92978661 623.46686415 -45.375 619.1875 C-46.47134766 619.02121094 -47.56769531 618.85492187 -48.69726562 618.68359375 C-76.4108496 614.36085102 -125.61157117 605.95092883 -146.375 585.1875 C-151.801418 585.63715016 -156.73687758 586.7235062 -161.91015625 588.42578125 C-162.637117 588.65836639 -163.36407776 588.89095154 -164.11306763 589.13058472 C-166.55667495 589.91392564 -168.99699263 590.70705886 -171.4375 591.5 C-173.20393617 592.0682319 -174.97062785 592.63567 -176.73754883 593.20239258 C-179.65226365 594.13743381 -182.56675434 595.07313519 -185.48045349 596.01133728 C-193.3114104 598.53188395 -201.15147582 601.02298797 -208.99550819 603.50245857 C-211.05090523 604.15218105 -213.10618198 604.8022827 -215.16142273 605.45249939 C-226.62709005 609.07974313 -226.62709005 609.07974313 -231.52249146 610.62564087 C-247.20336984 615.57880954 -262.84674056 620.62673856 -278.43022156 625.87846375 C-285.57118547 628.28015152 -292.72503123 630.56998809 -299.97460938 632.62120056 C-305.05165548 634.05949734 -310.00825943 635.7571953 -314.95703125 637.5859375 C-317.59473047 638.24216639 -318.82033766 637.93031876 -321.375 637.1875 C-318.82240887 628.35878878 -315.91424952 619.65139461 -313 610.9375 C-312.74033447 610.15938965 -312.48066895 609.3812793 -312.21313477 608.57958984 C-307.89345143 595.63757225 -303.49283354 582.72415668 -299.06204224 569.81982422 C-293.53136243 553.70794696 -288.13353247 537.55326588 -282.76879883 521.38549805 C-279.55515792 511.7028527 -276.33420703 502.02261864 -273.07421875 492.35546875 C-272.56858398 490.85209961 -272.56858398 490.85209961 -272.05273438 489.31835938 C-271.37524459 487.30459783 -270.69544669 485.29161173 -270.01367188 483.27929688 C-269.68302734 482.29380859 -269.35238281 481.30832031 -269.01171875 480.29296875 C-268.71998779 479.42824951 -268.42825684 478.56353027 -268.12768555 477.67260742 C-266.44594015 472.74346408 -266.44594015 472.74346408 -267.29614258 467.78173828 C-267.78236084 466.94884277 -268.2685791 466.11594727 -268.76953125 465.2578125 C-269.57729004 463.835896 -269.57729004 463.835896 -270.40136719 462.38525391 C-270.99079102 461.37124512 -271.58021484 460.35723633 -272.1875 459.3125 C-297.57358011 413.97040721 -309.63659889 363.64536077 -309.5625 311.8125 C-309.56189575 311.02614166 -309.5612915 310.23978333 -309.56066895 309.42959595 C-309.46878248 265.13303751 -300.37802457 222.67876246 -282.375 182.1875 C-282.0754541 181.4980127 -281.7759082 180.80852539 -281.46728516 180.09814453 C-277.35600104 170.66237331 -272.53223075 161.7181403 -267.375 152.8125 C-266.80571777 151.82612549 -266.23643555 150.83975098 -265.64990234 149.82348633 C-262.14918819 143.87566618 -258.37074129 138.24724879 -254.2512207 132.70996094 C-252.31380654 130.10522923 -250.43503679 127.46413447 -248.5625 124.8125 C-244.22193604 118.84635228 -239.50466699 113.24221847 -234.66845703 107.67626953 C-233.55289316 106.3922551 -232.44557285 105.10108707 -231.33984375 103.80859375 C-220.09852353 90.95817799 -207.89318751 78.6275015 -194.375 68.1875 C-192.6238793 66.70966026 -190.87391903 65.23044462 -189.125 63.75 C-182.54833914 58.37250237 -175.51721879 53.76769178 -168.375 49.1875 C-167.29089844 48.48496094 -166.20679688 47.78242187 -165.08984375 47.05859375 C-157.50765138 42.25747814 -149.67701037 38.18596889 -141.609375 34.28442383 C-139.94079954 33.4652685 -138.28063079 32.6289481 -136.625 31.78393555 C-129.70391425 28.25870437 -122.71919356 25.11329177 -115.5 22.25 C-113.88097778 21.60768433 -113.88097778 21.60768433 -112.22924805 20.95239258 C-76.15304613 6.84572339 -38.70953247 -0.05689988 0 0 Z M-96.375 72.1875 C-97.3954541 72.59669678 -97.3954541 72.59669678 -98.43652344 73.01416016 C-124.32177052 83.47189987 -148.59325985 99.21078851 -169.109375 118.10546875 C-171.18392036 120.0119044 -173.29765931 121.8551561 -175.4375 123.6875 C-182.77218468 130.10903116 -189.23711207 137.02911337 -195.32421875 144.640625 C-196.95996665 146.6720681 -198.63310464 148.62386163 -200.375 150.5625 C-240.95446634 197.71940731 -260.24570915 266.04469101 -255.85961914 327.33911133 C-253.49730351 356.64804913 -247.36182059 385.2615493 -235.375 412.1875 C-235.02179688 412.98736328 -234.66859375 413.78722656 -234.3046875 414.61132812 C-228.57831219 427.45447563 -222.18642181 440.20399947 -213.9296875 451.6328125 C-213.18976563 452.66148437 -212.44984375 453.69015625 -211.6875 454.75 C-211.02363281 455.61753906 -210.35976562 456.48507812 -209.67578125 457.37890625 C-207.00535395 463.1447838 -209.7284886 469.85732417 -211.67578125 475.578125 C-211.90827072 476.268564 -212.14076019 476.95900299 -212.3802948 477.67036438 C-213.14236683 479.92851429 -213.91489043 482.18293614 -214.6875 484.4375 C-215.22473961 486.02309162 -215.76118456 487.60895269 -216.296875 489.19506836 C-217.4158443 492.50653872 -218.53826376 495.81681241 -219.66259766 499.12646484 C-221.36139619 504.13633133 -223.03398054 509.15467367 -224.69921875 514.17578125 C-224.96728836 514.98359039 -225.23535797 515.79139954 -225.5115509 516.62368774 C-226.55126784 519.75750253 -227.59061312 522.89143967 -228.6288147 526.02575684 C-229.34478744 528.18564408 -230.0625005 530.34494157 -230.78125 532.50390625 C-231.00423264 533.17513519 -231.22721527 533.84636414 -231.45695496 534.53793335 C-233.081636 539.39607452 -234.83520283 544.19511021 -236.69335938 548.96850586 C-237.57076159 551.43788871 -237.57076159 551.43788871 -237.375 555.1875 C-230.08876549 553.69894524 -223.09294166 551.63178135 -216.01171875 549.37109375 C-214.82568558 548.9957399 -213.6396524 548.62038605 -212.41767883 548.23365784 C-209.26624842 547.23543552 -206.11591269 546.23385282 -202.96606445 545.23065186 C-199.86441319 544.24380802 -196.76121113 543.26186472 -193.65820312 542.27929688 C-191.19269803 541.49742831 -188.72720324 540.71552728 -186.26171875 539.93359375 C-185.04314178 539.54795258 -183.82456482 539.1623114 -182.56906128 538.76498413 C-176.84516415 536.94840612 -171.12842834 535.11490331 -165.43161678 533.21516705 C-163.48121714 532.56502819 -161.52937872 531.91939735 -159.57710266 531.2749176 C-157.13482074 530.46642922 -154.69565192 529.64845668 -152.26017761 528.81968689 C-151.16603043 528.45903641 -150.07188324 528.09838593 -148.94458008 527.72680664 C-147.98667068 527.40458633 -147.02876129 527.08236603 -146.04182434 526.75038147 C-141.30397793 525.75037337 -137.99363664 527.17076033 -133.9609375 529.59375 C-133.12739746 530.08593018 -132.29385742 530.57811035 -131.43505859 531.08520508 C-130.10595459 531.87834106 -130.10595459 531.87834106 -128.75 532.6875 C-104.31171054 546.92514651 -78.61059028 556.61911444 -51.0625 562.875 C-50.19915039 563.07754395 -49.33580078 563.28008789 -48.44628906 563.48876953 C-32.24690691 567.02151948 -15.64582738 567.57277297 0.875 567.5 C1.76575226 567.49784485 2.65650452 567.4956897 3.57424927 567.49346924 C67.8468452 567.24511573 129.32072382 542.86624719 175.98046875 498.62109375 C178.625 496.1875 178.625 496.1875 181.625 494.1875 C181.625 493.5275 181.625 492.8675 181.625 492.1875 C182.615 491.8575 183.605 491.5275 184.625 491.1875 C186.20516767 489.66680027 186.20516767 489.66680027 187.75 487.75 C189.66860163 485.47565765 191.58337329 483.23164708 193.625 481.06640625 C243.30210221 428.37580336 259.54339351 358.17901948 257.53271484 287.96484375 C255.70710295 245.76601902 238.29082071 201.69914384 214.625 167.1875 C213.79602111 165.94718487 212.96783858 164.70633693 212.140625 163.46484375 C211.38610781 162.35109397 210.63091493 161.23780159 209.875 160.125 C209.29685547 159.25584961 209.29685547 159.25584961 208.70703125 158.36914062 C207.73099739 156.93886264 206.68382487 155.55761938 205.625 154.1875 C204.965 154.1875 204.305 154.1875 203.625 154.1875 C203.25181641 153.3521875 203.25181641 153.3521875 202.87109375 152.5 C196.83693945 141.30182023 185.32721869 130.00727437 175.6328125 121.8828125 C173.33763591 119.94486184 171.14500437 117.91215033 168.9375 115.875 C128.8177596 79.7916969 76.03298233 58.87963867 22.625 54.1875 C21.10386597 54.0471936 21.10386597 54.0471936 19.55200195 53.90405273 C-19.64123706 50.41972834 -60.04181537 57.33616353 -96.375 72.1875 Z "
      fill="#179C0D"
      transform="translate(335.375,11.8125)"
    />
    <path
      d="M0 0 C1.51013672 0.04737305 1.51013672 0.04737305 3.05078125 0.09570312 C10.53702785 0.43420314 16.24741982 1.16281962 21.65625 6.78515625 C25.31652048 11.41753437 27.0811878 16.72640997 29 22.25 C29.78254024 24.4192751 30.56509232 26.58854594 31.34765625 28.7578125 C31.90477295 30.32837402 31.90477295 30.32837402 32.47314453 31.93066406 C33.74982227 35.51361794 35.08773041 39.06894981 36.4375 42.625 C36.89253906 43.85347656 37.34757812 45.08195312 37.81640625 46.34765625 C39.19332191 50.04137073 40.64060943 53.70520027 42.08984375 57.37109375 C43.01857383 59.76809565 43.94695721 62.16523192 44.875 64.5625 C45.32866943 65.68760986 45.78233887 66.81271973 46.24975586 67.97192383 C49.24665046 75.79532953 51.48688326 83.97100363 48.68579102 92.20629883 C43.90679869 102.3240976 34.10737682 111.62587436 26.0234375 119.1640625 C24.29337543 121.03607838 23.31443116 122.38672118 22.5 124.8125 C22.74871825 129.89345858 24.81168859 133.80575912 27.3125 138.125 C27.7055835 138.81287598 28.09866699 139.50075195 28.50366211 140.20947266 C38.22688598 156.86442025 50.31097103 171.80785989 63.5 185.8125 C64.11746094 186.4725 64.73492187 187.1325 65.37109375 187.8125 C80.42374922 203.4066179 99.31842679 214.63371682 118.25 224.8125 C119.31557129 225.40119873 120.38114258 225.98989746 121.47900391 226.59643555 C127.82889502 229.95065583 132.29826989 231.77841252 139.5 230.8125 C142.2666417 229.14400649 144.32215459 227.19019476 146.5 224.8125 C147.01691406 224.255625 147.53382813 223.69875 148.06640625 223.125 C149.9188851 221.05379473 151.70911562 218.93727808 153.5 216.8125 C156.49050388 213.30186088 159.49210946 209.80097634 162.50390625 206.30859375 C164.37710669 204.13520475 166.21006585 201.94439785 168.02734375 199.72265625 C168.78144531 198.82417969 169.53554688 197.92570313 170.3125 197 C171.28123047 195.81470703 171.28123047 195.81470703 172.26953125 194.60546875 C175.35766818 192.12306096 177.56798005 191.92195666 181.5 191.8125 C192.34341138 194.50676256 202.36078745 200.84616393 212.03125 206.24609375 C216.90963331 208.96105389 221.83202213 211.57781204 226.78125 214.16015625 C228.22665801 214.91688382 229.67205186 215.67363844 231.11743164 216.43041992 C233.25987175 217.55162291 235.40355057 218.66997387 237.55221558 219.77920532 C253.08922076 227.80566951 253.08922076 227.80566951 257.5 232.8125 C258.32421875 236.3359375 258.32421875 236.3359375 258.1875 240.1875 C258.16333008 240.8786792 258.13916016 241.5698584 258.11425781 242.28198242 C257.68845453 250.06344952 255.76731149 257.39078143 253.5 264.8125 C253.19964844 265.84632813 252.89929688 266.88015625 252.58984375 267.9453125 C247.64907363 283.30233823 234.37554847 292.62510633 220.79296875 300.21484375 C210.2850167 305.31300791 199.1851527 308.94446008 187.5 309.8125 C186.8395166 309.86164551 186.1790332 309.91079102 185.49853516 309.96142578 C138.53386137 312.95779989 81.62797249 280.01527231 46.5 250.8125 C45.4790625 249.9771875 44.458125 249.141875 43.40625 248.28125 C30.3276789 237.43555913 17.77588969 225.51276589 7.296875 212.109375 C5.62432971 209.97142581 3.8786366 207.95357825 2.0625 205.9375 C-11.47104124 190.568375 -22.58462732 173.08178158 -33.5 155.8125 C-33.90492676 155.1745752 -34.30985352 154.53665039 -34.72705078 153.87939453 C-53.46453689 124.17626447 -64.98193782 91.01572766 -57.4765625 55.71484375 C-54.18583186 41.83995151 -47.50036173 29.74627277 -38.5 18.8125 C-37.860625 17.94625 -37.22125 17.08 -36.5625 16.1875 C-26.18753022 4.2405651 -15.66950276 -0.79250366 0 0 Z"
      fill="#179C0D"
      transform="translate(240.5,169.1875)"
    />
  </svg>
);

const getMessageDirection = (message: string): "inbound" | "outbound" => {
  const cleanMsg = message.trim();
  if (
    cleanMsg.startsWith("IA") ||
    cleanMsg.startsWith("¡Prueba") ||
    cleanMsg.startsWith("¡Visita") ||
    cleanMsg.startsWith("¡Demo") ||
    cleanMsg.startsWith("Transfiriendo")
  ) {
    return "outbound";
  }
  return "inbound";
};

export default function CrmDashboard({
  prospects,
  selectedProspectId,
  onClearSelection,
  onAddProspect,
  onUpdateStatus,
  onUpdateProspect,
  onDeleteProspect,
  currentTierName,
  currentUser,
  readonlyMode = false,
  onBackToSharedList,
}: CrmDashboardProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadsByProspect, setLeadsByProspect] = useState<Record<string, SimulatedLead[]>>({});
  const [simulationActive, setSimulationActive] = useState(true);

  // Estados de navegación interna del cliente y recargas de alcancía
  const [detailTab, setDetailTab] = useState<"leads" | "alcancia" | "invoices">("leads");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeLeadsAmount, setRechargeLeadsAmount] = useState<number>(20);
  const [customLeadsAmount, setCustomLeadsAmount] = useState<string>("");
  const [topupMethod, setTopupMethod] = useState<"link" | "card">("link");
  const [generatedPayUrl, setGeneratedPayUrl] = useState<string | null>(null);
  const [topupCopied, setTopupCopied] = useState(false);
  const [topupSuccess, setTopupSuccess] = useState(false);
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  // Estados para compartir dashboard (Estilo Google Drive)
  const [sharingProspect, setSharingProspect] = useState<Prospect | null>(null);
  const [sharedEmails, setSharedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoadingSharing, setIsLoadingSharing] = useState(false);

  // Auto-cargar prospecto si está en modo solo lectura y hay uno solo
  useEffect(() => {
    if (prospects.length === 1 && readonlyMode && !selectedProspectId) {
      // parent handles selection via onClearSelection flow
    }
  }, [prospects, readonlyMode, selectedProspectId]);

  // Suscribirse a los correos compartidos en tiempo real
  useEffect(() => {
    if (!sharingProspect || !currentUser) {
      setSharedEmails([]);
      return;
    }

    const docId = `${currentUser.uid}_${sharingProspect.id}`;
    const docRef = doc(db, "shared_dashboards", docId);

    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSharedEmails(data.sharedEmails || []);
      } else {
        setSharedEmails([]);
      }
    }, (error) => {
      console.error("Error al leer accesos compartidos:", error);
    });

    return () => unsub();
  }, [sharingProspect, currentUser]);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !sharingProspect || !currentUser) return;

    const emailToAdd = newEmail.trim().toLowerCase();
    if (!emailToAdd.includes("@")) {
      alert("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setIsLoadingSharing(true);
    try {
      const docId = `${currentUser.uid}_${sharingProspect.id}`;
      const docRef = doc(db, "shared_dashboards", docId);

      const updatedEmails = [...sharedEmails];
      if (!updatedEmails.includes(emailToAdd)) {
        updatedEmails.push(emailToAdd);
      }

      await setDoc(docRef, {
        id: docId,
        ownerId: currentUser.uid,
        prospectId: sharingProspect.id,
        company: sharingProspect.company,
        name: sharingProspect.name,
        email: sharingProspect.email,
        industry: sharingProspect.industry,
        estimatedValue: sharingProspect.estimatedValue,
        status: sharingProspect.status,
        createdAt: sharingProspect.createdAt,
        sharedEmails: updatedEmails,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setNewEmail("");
    } catch (err) {
      console.error("Error al compartir dashboard:", err);
      alert("Hubo un error al agregar el acceso.");
    } finally {
      setIsLoadingSharing(false);
    }
  };

  const handleRemoveEmail = async (emailToRemove: string) => {
    if (!sharingProspect || !currentUser) return;
    if (!confirm(`¿Deseas revocar el acceso a ${emailToRemove}?`)) return;

    setIsLoadingSharing(true);
    try {
      const docId = `${currentUser.uid}_${sharingProspect.id}`;
      const docRef = doc(db, "shared_dashboards", docId);

      const updatedEmails = sharedEmails.filter(e => e !== emailToRemove);

      await setDoc(docRef, {
        sharedEmails: updatedEmails,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Error al remover acceso:", err);
      alert("Hubo un error al revocar el acceso.");
    } finally {
      setIsLoadingSharing(false);
    }
  };

  const shareUrl = sharingProspect && currentUser
    ? `${window.location.origin}/?sharedDashboardId=${currentUser.uid}_${sharingProspect.id}`
    : "";

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Estados para canales de interacción IA (inline chat)
  const [activeChannelTab, setActiveChannelTab] = useState<"whatsapp" | "instagram" | "email" | "phone">("whatsapp");
  const [whatsappInput, setWhatsappInput] = useState("");
  const [instagramInput, setInstagramInput] = useState("");
  const [customWhatsAppChats, setCustomWhatsAppChats] = useState<Record<string, { sender: "bot" | "lead"; text: string; time: string }[]>>({});
  const [customInstagramChats, setCustomInstagramChats] = useState<Record<string, { sender: "bot" | "lead"; text: string; time: string }[]>>({});
  const [isBotTypingWhatsApp, setIsBotTypingWhatsApp] = useState(false);
  const [isBotTypingInstagram, setIsBotTypingInstagram] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);

  // Efecto del reproductor de llamadas de voz de Nexor IA
  useEffect(() => {
    let interval: any;
    if (isAudioPlaying) {
      interval = setInterval(() => {
        setAudioTime((prev) => {
          if (prev >= 44) {
            setIsAudioPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  // Generador contextual de Leads según la industria del cliente (Todos inician como NUEVOS para ver el efecto embudo)
  const getInitialLeads = (prospect: Prospect): SimulatedLead[] => {
    const ind = prospect.industry.toLowerCase();

    if (ind.includes("auto")) {
      return [
        {
          id: "l_1",
          name: "Marcos Torres",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, me interesa agendar una prueba de manejo para el Nexor Sedán Híbrido.",
          lastActive: "Hace 5 min",
          timestamp: Date.now() - 5 * 60 * 1000,
          productOfInterest: "Nexor Sedán Híbrido",
          phoneOrUser: "+52 55 1234 5678"
        },
        {
          id: "l_2",
          name: "Valentina Luna",
          channel: "instagram",
          status: "nuevo",
          latestMessage: "Buenas tardes, ¿qué requisitos piden para el plan de financiamiento de la SUV?",
          lastActive: "Hace 25 min",
          timestamp: Date.now() - 25 * 60 * 1000,
          productOfInterest: "SUV Eléctrica",
          phoneOrUser: "@valentina_luna"
        },
        {
          id: "l_3",
          name: "Javier Ortega",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, me gustaría conocer las mensualidades estimadas para el Sedán Confort.",
          lastActive: "Hace 1 hora",
          timestamp: Date.now() - 60 * 60 * 1000,
          productOfInterest: "Sedán Confort",
          phoneOrUser: "+52 55 9876 5432"
        },
        {
          id: "l_4",
          name: "Sofía Méndez",
          channel: "phone",
          status: "nuevo",
          latestMessage: "Me interesa recibir información del Hatchback Deportivo. ¿Tienen entrega inmediata?",
          lastActive: "Hace 3 horas",
          timestamp: Date.now() - 180 * 60 * 1000,
          productOfInterest: "Hatchback Deportivo",
          phoneOrUser: "+52 55 2468 1357"
        },
        {
          id: "l_5",
          name: "Roberto Díaz",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, vi su anuncio del híbrido. ¿Tiene garantía de batería?",
          lastActive: "Hace 5 horas",
          timestamp: Date.now() - 300 * 60 * 1000,
          productOfInterest: "Nexor Híbrido",
          phoneOrUser: "+52 55 1357 2468"
        }
      ];
    } else if (ind.includes("inmob") || ind.includes("raiz")) {
      return [
        {
          id: "l_1",
          name: "Gabriela Ríos",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, me interesa conocer la fecha de entrega del proyecto de 2 Recámaras.",
          lastActive: "Hace 12 min",
          timestamp: Date.now() - 12 * 60 * 1000,
          productOfInterest: "Departamento 2 Recámaras",
          phoneOrUser: "+52 55 5432 1098"
        },
        {
          id: "l_2",
          name: "Felipe Soto",
          channel: "email",
          status: "nuevo",
          latestMessage: "Por favor envíame el folleto técnico con precios de preventa del Penthouse.",
          lastActive: "Hace 40 min",
          timestamp: Date.now() - 40 * 60 * 1000,
          productOfInterest: "Penthouse Cumbres",
          phoneOrUser: "felipe.soto@mail.com"
        },
        {
          id: "l_3",
          name: "Camila Varela",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Buenas tardes, ¿tienen opción de financiamiento bancario o directo para el Loft?",
          lastActive: "Hace 2 horas",
          timestamp: Date.now() - 120 * 60 * 1000,
          productOfInterest: "Departamento Loft",
          phoneOrUser: "+52 55 1122 3344"
        },
        {
          id: "l_4",
          name: "Héctor Silva",
          channel: "instagram",
          status: "nuevo",
          latestMessage: "Quiero agendar una visita a la casa muestra de 3 Recámaras.",
          lastActive: "Hace 4 horas",
          timestamp: Date.now() - 240 * 60 * 1000,
          productOfInterest: "Casa 3 Recámaras",
          phoneOrUser: "@hector_silvare"
        },
        {
          id: "l_5",
          name: "Lucía Domínguez",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Quiero información sobre los departamentos de preventa y descuentos.",
          lastActive: "Hace 8 horas",
          timestamp: Date.now() - 480 * 60 * 1000,
          productOfInterest: "Departamento",
          phoneOrUser: "+52 55 9988 7766"
        }
      ];
    } else if (ind.includes("saas") || ind.includes("soft") || ind.includes("b2b")) {
      return [
        {
          id: "l_1",
          name: "Daniel Blanco",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, me interesa agendar una demo técnica de la API corporativa.",
          lastActive: "Hace 3 min",
          timestamp: Date.now() - 3 * 60 * 1000,
          productOfInterest: "Licencia Corporativa",
          phoneOrUser: "+34 612 345 678"
        },
        {
          id: "l_2",
          name: "Patricia Cruz",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Ya activé la demo, pero quiero saber costos adicionales para el plan profesional.",
          lastActive: "Hace 15 min",
          timestamp: Date.now() - 15 * 60 * 1000,
          productOfInterest: "Plan Profesional",
          phoneOrUser: "+34 699 887 766"
        },
        {
          id: "l_3",
          name: "Álvaro Ruiz",
          channel: "email",
          status: "nuevo",
          latestMessage: "Hola, me gustaría saber si la API soporta integraciones personalizadas.",
          lastActive: "Hace 1 hora",
          timestamp: Date.now() - 60 * 60 * 1000,
          productOfInterest: "SaaS API",
          phoneOrUser: "alvaro@softwarehouse.es"
        },
        {
          id: "l_4",
          name: "Isabel Castro",
          channel: "phone",
          status: "nuevo",
          latestMessage: "Hola, ¿cómo funciona el bot de voz inteligente para un call center?",
          lastActive: "Hace 6 horas",
          timestamp: Date.now() - 360 * 60 * 1000,
          productOfInterest: "Integración CRM",
          phoneOrUser: "+34 688 776 554"
        },
        {
          id: "l_5",
          name: "Mauricio Alanís",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, me interesa conocer la compatibilidad con HubSpot.",
          lastActive: "Hace 10 hours",
          timestamp: Date.now() - 600 * 60 * 1000,
          productOfInterest: "Plan Básico",
          phoneOrUser: "+34 655 443 221"
        }
      ];
    } else {
      // General o Estética/Salud
      return [
        {
          id: "l_1",
          name: "Verónica Salas",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, quiero reservar una cita para limpieza dental.",
          lastActive: "Hace 8 min",
          timestamp: Date.now() - 8 * 60 * 1000,
          productOfInterest: "Limpieza Dental",
          phoneOrUser: "+52 55 8877 6655"
        },
        {
          id: "l_2",
          name: "Sandra López",
          channel: "instagram",
          status: "nuevo",
          latestMessage: "Hola, me gustaría cotizar una consulta estética para el miércoles.",
          lastActive: "Hace 30 min",
          timestamp: Date.now() - 30 * 60 * 1000,
          productOfInterest: "Consulta Estética",
          phoneOrUser: "@sandra_l"
        },
        {
          id: "l_3",
          name: "Alberto Peña",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, quería consultar qué costo tiene el tratamiento facial.",
          lastActive: "Hace 3 horas",
          timestamp: Date.now() - 180 * 60 * 1000,
          productOfInterest: "Tratamiento Facial",
          phoneOrUser: "+52 55 4433 2211"
        },
        {
          id: "l_4",
          name: "Diana Guerrero",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Buenas, ¿tienen promociones para limpieza profunda este mes?",
          lastActive: "Hace 7 horas",
          timestamp: Date.now() - 420 * 60 * 1000,
          productOfInterest: "Limpieza profunda",
          phoneOrUser: "+52 55 1223 3445"
        },
        {
          id: "l_5",
          name: "Enrique Marín",
          channel: "whatsapp",
          status: "nuevo",
          latestMessage: "Hola, quería consultar qué costo tiene el blanqueamiento.",
          lastActive: "Hace 12 horas",
          timestamp: Date.now() - 720 * 60 * 1000,
          productOfInterest: "Blanqueamiento",
          phoneOrUser: "+52 55 6677 8899"
        }
      ];
    }
  };

  // Cargar leads de la empresa seleccionada si no existen
  useEffect(() => {
    if (selectedProspectId) {
      const activeProspect = prospects.find((p) => p.id === selectedProspectId);
      if (activeProspect && !leadsByProspect[selectedProspectId]) {
        setLeadsByProspect((prev) => ({
          ...prev,
          [selectedProspectId]: getInitialLeads(activeProspect),
        }));
      }
    }
  }, [selectedProspectId, prospects]);

  // Motor de simulación en tiempo real (Autocalificación de Leads - Movimiento el DOBLE de lento)
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setLeadsByProspect((prev) => {
        const nextLeads = { ...prev };
        const activeId = selectedProspectId;
        if (!activeId) return prev;

        const currentLeads = nextLeads[activeId] || [];
        if (currentLeads.length === 0) return prev;

        // Buscar leads elegibles para avanzar de estado (no cerrados, no fríos, no traspasados a humanos)
        const eligibleLeads = currentLeads.filter((l) => l.status !== "cerrado" && l.status !== "frio" && l.status !== "humano");
        if (eligibleLeads.length === 0) return prev;

        // Seleccionar uno al azar para simular el siguiente paso de calificación del embudo
        const randomLead = eligibleLeads[Math.floor(Math.random() * eligibleLeads.length)];
        const activeProspect = prospects.find(p => p.id === activeId);
        const ind = (activeProspect?.industry || "general").toLowerCase();

        let nextStatus: SimulatedLead["status"] = "nuevo";
        let message = "";

        if (randomLead.status === "nuevo") {
          nextStatus = "caliente";
          message = ind.includes("auto")
            ? "Cliente: Me interesa financiamiento de la SUV Eléctrica con un 20% de enganche inicial."
            : ind.includes("inmob")
              ? "Cliente: Sí, buscamos departamento de 2 recámaras listo para habitar con mi familia."
              : "Cliente: Necesito la demo para ver si se integra de forma directa con nuestro CRM actual.";
        } else if (randomLead.status === "caliente") {
          // De caliente puede pasar a cerrado, humano o frio
          const rand = Math.random();
          if (rand < 0.60) {
            nextStatus = "cerrado";
            message = ind.includes("auto")
              ? "¡Prueba de manejo agendada automáticamente en agenda de la sucursal! Sábado 12:00 PM."
              : ind.includes("inmob")
                ? "¡Visita de obra guiada reservada con éxito por Nexor! Domingo a las 3:30 PM."
                : "¡Demo técnica y acceso Onboarding agendados de manera autónoma en Google Calendar!";
          } else if (rand < 0.85) {
            nextStatus = "humano";
            message = "IA Nexor: Su consulta requiere una validación personalizada de contrato internacional. Transfiriendo ahora mismo con un asesor del equipo humano...";
          } else {
            nextStatus = "frio";
            message = "Cliente: Lo platiqué con mi esposa y de momento no seguiremos con el proceso. Gracias.";
          }
        }

        const updatedLeads = currentLeads.map((l) => {
          if (l.id === randomLead.id) {
            return {
              ...l,
              status: nextStatus,
              latestMessage: message,
              lastActive: "Justo ahora ⚡",
              timestamp: Date.now()
            };
          }
          return l;
        });

        // Ordenar: Los más recientes primero
        updatedLeads.sort((a, b) => b.timestamp - a.timestamp);

        nextLeads[activeId] = updatedLeads;
        return nextLeads;
      });
    }, 14000); // Avanzar un lead cada 14 segundos (el doble de lento como pidió el usuario)

    return () => clearInterval(interval);
  }, [selectedProspectId, simulationActive, prospects]);

  // Forzar entrada de un lead nuevo simulado
  const handleForceNewLead = () => {
    if (!selectedProspectId) return;

    const activeProspect = prospects.find((p) => p.id === selectedProspectId);
    if (!activeProspect) return;

    const names = [
      "Sofía Ortega", "Luis Escalante", "María José", "Roberto Martínez", "Andrea Peña",
      "Guillermo Díaz", "Estela Castro", "Humberto Vega", "Clara Benítez", "Raúl Solís"
    ];

    const productsByIndustry: Record<string, string[]> = {
      automotriz: ["Nexor Sedán", "SUV Eléctrica", "Hatchback Deportivo"],
      inmobiliaria: ["Departamento Preventa", "Loft de Lujo", "Casa Residencial"],
      saas: ["Licencia Corporativa API", "Plan Growth SaaS", "Onboarding Directo"],
      general: ["Asesoría de IA", "Automatización WhatsApp", "Chatbot Web"]
    };

    const name = names[Math.floor(Math.random() * names.length)];
    const ind = activeProspect.industry.toLowerCase();
    const indKey = ind.includes("auto") ? "automotriz" : ind.includes("inmob") ? "inmobiliaria" : ind.includes("saas") ? "saas" : "general";
    const products = productsByIndustry[indKey];
    const product = products[Math.floor(Math.random() * products.length)];

    const channels: SimulatedLead["channel"][] = ["whatsapp", "instagram", "phone", "email"];
    const channel = channels[Math.floor(Math.random() * channels.length)];

    const phones = ["+52 55 3322 1100", "+52 55 9900 8877", "+34 600 112 233", "+57 311 222 3344"];
    const users = ["@sofia_ort", "@luis_es", "@maria_jo", "@rob_mart"];

    const phoneOrUser = channel === "instagram"
      ? users[Math.floor(Math.random() * users.length)]
      : channel === "email"
        ? `${name.toLowerCase().replace(" ", "")}@ejemplo.com`
        : phones[Math.floor(Math.random() * phones.length)];

    const messages = [
      `Hola, me interesa conocer más detalles sobre el enganche de ${product}.`,
      `Buenas tardes, ¿me pueden cotizar la versión equipada de ${product}?`,
      `¿Tienen horarios de atención disponibles para ver ${product}?`,
      `Vi su publicidad en redes, quiero agendar una demostración de ${product}.`
    ];
    const latestMessage = messages[Math.floor(Math.random() * messages.length)];

    const newLead: SimulatedLead = {
      id: "l_" + Date.now(),
      name,
      channel,
      status: "nuevo",
      latestMessage,
      lastActive: "Justo ahora ⚡",
      timestamp: Date.now(),
      productOfInterest: product,
      phoneOrUser
    };

    setLeadsByProspect((prev) => {
      const currentLeads = prev[selectedProspectId] || [];
      const updated = [newLead, ...currentLeads];
      return {
        ...prev,
        [selectedProspectId]: updated
      };
    });
  };

  // Resetear leads de la simulación
  const handleResetLeads = () => {
    if (!selectedProspectId) return;
    const activeProspect = prospects.find((p) => p.id === selectedProspectId);
    if (activeProspect) {
      setLeadsByProspect((prev) => ({
        ...prev,
        [selectedProspectId]: getInitialLeads(activeProspect)
      }));
    }
  };

  // Icono del canal de comunicación con colores según dirección
  const renderChannelIcon = (channel: SimulatedLead["channel"], direction: "inbound" | "outbound") => {
    const iconColor = direction === "inbound" ? "text-blue-600 animate-pulse" : "text-emerald-600";
    switch (channel) {
      case "whatsapp":
        return <WhatsAppIcon className="h-3 w-3 flex-shrink-0" />;
      case "phone":
        return <Phone className={`h-3 w-3 ${iconColor}`} />;
      case "instagram":
        return <Instagram className="h-3 w-3 text-red-500 flex-shrink-0" />;
      case "email":
        return <Mail className={`h-3 w-3 ${iconColor}`} />;
      default:
        return <MessageSquare className={`h-3 w-3 ${iconColor}`} />;
    }
  };

  const getChannelBadgeLabel = (channel: SimulatedLead["channel"], latestMessage: string) => {
    const direction = getMessageDirection(latestMessage) === "inbound" ? "Inbound" : "Outbound";
    switch (channel) {
      case "whatsapp": return `WhatsApp ${direction}`;
      case "phone": return `Llamada ${direction}`;
      case "instagram": return `Instagram ${direction}`;
      case "email": return `Email ${direction}`;
      default: return `Chat ${direction}`;
    }
  };

  const activeProspectDetails = selectedProspectId
    ? prospects.find((p) => p.id === selectedProspectId)
    : null;

  // Generador dinámico de historial de conversación para los detalles de un Lead
  const generateLeadConversation = (lead: SimulatedLead) => {
    const ind = (activeProspectDetails?.industry || "general").toLowerCase();
    const prod = lead.productOfInterest || (ind.includes("auto") ? "Nexor SUV" : ind.includes("inmob") ? "Departamento" : "Plan SaaS");

    const base = [
      {
        sender: "lead",
        time: "Hace 2 horas",
        text: `Hola, vi su anuncio sobre ${prod}. Me gustaría recibir más información, por favor.`
      },
      {
        sender: "bot",
        time: "Hace 2 horas",
        text: `¡Hola, qué gusto saludarte! 👋 Soy el asistente conversacional con Inteligencia Artificial de ${activeProspectDetails?.company}. Con gusto te ayudo. ¿Te gustaría conocer el catálogo de precios, las opciones de financiamiento o agendar una cita directa con un asesor?`
      }
    ];

    if (lead.status === "nuevo") {
      base.push({
        sender: "lead",
        time: lead.lastActive,
        text: lead.latestMessage
      });
      return base;
    }

    base.push({
      sender: "lead",
      time: "Hace 1 hora",
      text: `Prefiero ver el catálogo de precios y opciones de financiamiento, por favor.`
    });

    base.push({
      sender: "bot",
      time: "Hace 1 hora",
      text: `¡Excelente decisión! Te he enviado el folleto digital directo a tu canal de chat. 📄 Contamos con excelentes facilidades y enganche cómodo. ¿Te interesaría que agendemos una llamada de 5 minutos o una cita de demostración?`
    });

    if (lead.status === "caliente") {
      base.push({
        sender: "lead",
        time: lead.lastActive,
        text: lead.latestMessage
      });
      return base;
    }

    if (lead.status === "cerrado") {
      base.push({
        sender: "lead",
        time: "Hace 15 min",
        text: lead.latestMessage
      });
      base.push({
        sender: "bot",
        time: "Hace 14 min",
        text: `¡Excelente! Hemos agendado y bloqueado tu espacio de manera autónoma en el calendario del equipo comercial de ${activeProspectDetails?.company}. Te enviamos los accesos y un recordatorio en breve. ¡Muchas gracias, nos vemos pronto! 🎉`
      });
      return base;
    }

    if (lead.status === "humano") {
      base.push({
        sender: "lead",
        time: "Hace 20 min",
        text: "Tengo una consulta bastante específica sobre la cobertura de impuestos internacionales y convenios de exportación. ¿La garantía cubre eso?"
      });
      base.push({
        sender: "bot",
        time: lead.lastActive,
        text: lead.latestMessage
      });
      return base;
    }

    if (lead.status === "frio") {
      base.push({
        sender: "lead",
        time: lead.lastActive,
        text: lead.latestMessage
      });
      base.push({
        sender: "bot",
        time: "Hace pocos segundos",
        text: `Entendido perfectamente. Agradecemos mucho tu tiempo de respuesta y el interés en ${activeProspectDetails?.company}. Si en el futuro decides retomar, estaremos listos para atenderte las 24 horas. ¡Mucho éxito!`
      });
      return base;
    }

    return base;
  };

  // Obtiene los datos de un canal de comunicación para simular emails, chats e interactuar con la IA
  const getChannelData = (lead: SimulatedLead, channel: "whatsapp" | "instagram" | "email" | "phone") => {
    const ind = (activeProspectDetails?.industry || "general").toLowerCase();
    const prod = lead.productOfInterest || (ind.includes("auto") ? "Nexor SUV" : ind.includes("inmob") ? "Departamento" : "Plan SaaS");
    const companyName = activeProspectDetails?.company || "Empresa";

    if (channel === "whatsapp") {
      const base = [
        {
          sender: "lead" as const,
          time: "Hace 2 horas",
          text: `Hola, vi su anuncio sobre ${prod}. Me gustaría recibir más información, por favor.`
        },
        {
          sender: "bot" as const,
          time: "Hace 2 horas",
          text: `¡Hola, qué gusto saludarte! 👋 Soy el asistente conversacional con Inteligencia Artificial de ${companyName}. Con gusto te ayudo. ¿Te gustaría conocer el catálogo de precios, las opciones de financiamiento o agendar una cita directa con un asesor?`
        }
      ];

      if (lead.status === "nuevo") {
        base.push({
          sender: "lead" as const,
          time: lead.lastActive,
          text: lead.latestMessage
        });
      } else {
        base.push({
          sender: "lead" as const,
          time: "Hace 1 hora",
          text: `Prefiero ver el catálogo de precios y opciones de financiamiento, por favor.`
        });
        base.push({
          sender: "bot" as const,
          time: "Hace 1 hora",
          text: `¡Excelente decisión! Te he enviado el folleto digital directo a tu canal de chat. 📄 Contamos con excelentes facilidades y enganche cómodo. ¿Te interesaría que agendemos una llamada de 5 minutos o una cita de demostración?`
        });

        if (lead.status === "caliente") {
          base.push({
            sender: "lead" as const,
            time: lead.lastActive,
            text: lead.latestMessage
          });
        } else if (lead.status === "cerrado") {
          base.push({
            sender: "lead" as const,
            time: "Hace 15 min",
            text: lead.latestMessage
          });
          base.push({
            sender: "bot" as const,
            time: "Hace 14 min",
            text: `¡Excelente! Hemos agendado y bloqueado tu espacio de manera autónoma en el calendario del equipo comercial de ${companyName}. Te enviamos los accesos y un recordatorio en breve. ¡Muchas gracias, nos vemos pronto! 🎉`
          });
        } else if (lead.status === "humano") {
          base.push({
            sender: "lead" as const,
            time: "Hace 20 min",
            text: "Tengo una consulta bastante específica sobre la cobertura de impuestos internacionales. ¿La garantía cubre eso?"
          });
          base.push({
            sender: "bot" as const,
            time: lead.lastActive,
            text: lead.latestMessage
          });
        } else if (lead.status === "frio") {
          base.push({
            sender: "lead" as const,
            time: lead.lastActive,
            text: lead.latestMessage
          });
          base.push({
            sender: "bot" as const,
            time: "Hace pocos segundos",
            text: `Entendido perfectamente. Agradecemos mucho tu tiempo de respuesta y el interés en ${companyName}. Si en el futuro decides retomar, estaremos listos para atenderte las 24 horas. ¡Mucho éxito!`
          });
        }
      }
      return base;
    }

    if (channel === "instagram") {
      const base = [
        {
          sender: "lead" as const,
          time: "Hace 3 horas",
          text: `Hola! Vi su publicación de ${prod} en Instagram. ¿Hacen visitas los fines de semana?`
        },
        {
          sender: "bot" as const,
          time: "Hace 3 horas",
          text: `¡Hola! Qué gusto que nos escribas por Instagram Direct. 📸 Sí, absolutamente, el equipo de ${companyName} atiende sábados y domingos bajo cita previa. ¿Te gustaría recibir el folleto por aquí?`
        }
      ];

      if (lead.status === "nuevo") {
        base.push({
          sender: "lead" as const,
          time: lead.lastActive,
          text: "¡Qué rápido responden! Me gustaría recibir el catálogo de preventa por favor."
        });
      } else {
        base.push({
          sender: "lead" as const,
          time: "Hace 2 horas",
          text: "Me gustaría recibir el catálogo de precios de preventa por favor."
        });
        base.push({
          sender: "bot" as const,
          time: "Hace 2 hours",
          text: `¡Claro que sí! Aquí tienes el catálogo digital de ${prod}. También puedes agendar directo. ¿Te gustaría que un asesor te marque por teléfono para darte una cotización a tu medida?`
        });

        if (lead.status === "caliente") {
          base.push({
            sender: "lead" as const,
            time: lead.lastActive,
            text: `Sí, mi usuario es ${lead.phoneOrUser}. Me pueden mandar un mensaje de texto o marcar por la tarde.`
          });
        } else if (lead.status === "cerrado") {
          base.push({
            sender: "lead" as const,
            time: "Hace 45 min",
            text: "Sí, agendemos la cita para este sábado en la mañana."
          });
          base.push({
            sender: "bot" as const,
            time: "Hace 44 min",
            text: `¡Perfecto! Hemos bloqueado tu visita para este sábado. Te enviamos la confirmación e indicaciones por DM. ¡Gracias por confiar en ${companyName}! ✨`
          });
        } else {
          base.push({
            sender: "lead" as const,
            time: lead.lastActive,
            text: "Gracias, por ahora solo estoy comparando opciones."
          });
        }
      }
      return base;
    }

    if (channel === "email") {
      return {
        subject: `Re: Información y Cotización Especial - ${prod} [Ref: #${lead.id}]`,
        senderEmail: lead.phoneOrUser.includes("@") ? lead.phoneOrUser : `${lead.name.toLowerCase().replace(" ", "")}@ejemplo.com`,
        body: `Estimado equipo de ${companyName},

Me pongo en contacto con ustedes porque estoy sumamente interesado en adquirir ${prod}. He visto algunas referencias de su empresa y me gustaría que me asistan con la siguiente información:

1. Catálogo completo de especificaciones técnicas.
2. Lista de precios oficial para este mes y planes de financiamiento o descuento por pago de contado.
3. Tiempos de entrega estimadas para mi zona.

Quedo a la espera de sus valiosos comentarios para poder tomar una decisión esta misma semana.

Atentamente,
${lead.name}
Contacto: ${lead.phoneOrUser}`,
        reply: `Estimado/a ${lead.name},

Agradecemos sinceramente su interés en ${companyName} y en nuestro producto: ${prod}.

Como parte de nuestro compromiso de atención inmediata 24/7 de Nexor IA, le adjunto el Folleto Técnico y la corrida financiera preliminar con un 10% de descuento exclusivo aplicado por preventa.

Puede consultar el documento completo en el siguiente enlace seguro:
👉 [Ver Documentación y Precios de ${prod}]

Para su comodidad, nuestro Agente de Inteligencia Artificial ha reservado una ranura de consulta técnica sin costo para usted en el calendario de nuestro especialista de cuentas. 

¿Le viene bien confirmar esta llamada breve para mañana a las 11:30 AM o prefiere otro horario?

Atentamente,
Agente Inteligente Nexor IA
En representación de ${companyName}`
      };
    }

    if (channel === "phone") {
      let transcript = [];
      let summary = {
        objective: "",
        result: "",
        sentiment: "",
        action: ""
      };

      if (ind.includes("auto")) {
        transcript = [
          { time: "0:05", speaker: "Nexor IA (Voz)", text: `¡Hola! Bienvenido a la línea de atención automatizada de ${companyName}. ¿Habló con el señor ${lead.name}?` },
          { time: "0:11", speaker: `${lead.name} (Cliente)`, text: `Sí, hola. Vi su anuncio sobre la SUV Eléctrica y quería saber si tienen disponibilidad para verla hoy por la tarde.` },
          { time: "0:21", speaker: "Nexor IA (Voz)", text: `¡Excelente, ${lead.name}! Sí, hoy mismo tenemos la SUV en exhibición en nuestra sucursal. Me queda libre un espacio para prueba de manejo a las 4:30 PM o a las 6:00 PM con un asesor de ventas dedicado. ¿Cuál te queda mejor?` },
          { time: "0:36", speaker: `${lead.name} (Cliente)`, text: `El de las 4:30 PM me queda perfecto. ¿Qué documentos tengo que llevar para la prueba?` },
          { time: "0:42", speaker: "Nexor IA (Voz)", text: `¡Súper! Queda agendado para hoy a las 4:30 PM. Solo necesitas traer tu identificación oficial y licencia de conducir vigente. Te acabo de enviar un SMS con la dirección exacta. ¡Te esperamos!` }
        ];
        summary = {
          objective: `Agendar prueba de manejo de SUV Eléctrica`,
          result: `Cita confirmada hoy a las 4:30 PM con asesor asignado de forma automática`,
          sentiment: `Muy positivo y entusiasmado 📈`,
          action: `Enviar recordatorio automatizado por WhatsApp 1 hora antes de la cita con mapa de Google Maps`
        };
      } else if (ind.includes("inmob") || ind.includes("raiz")) {
        transcript = [
          { time: "0:05", speaker: "Nexor IA (Voz)", text: `¡Buen día! Te hablas de la desarrolladora inmobiliaria de ${companyName}. ¿Tengo el gusto con ${lead.name}?` },
          { time: "0:12", speaker: `${lead.name} (Cliente)`, text: `Hola, sí. Vi su anuncio sobre los departamentos de preventa y quería saber si el financiamiento es directo con ustedes o con banco.` },
          { time: "0:22", speaker: "Nexor IA (Voz)", text: `Con gusto, ${lead.name}. Manejamos ambas opciones: financiamiento directo de preventa a 12 meses sin intereses, o créditos bancarios tradicionales con tasas preferenciales. ¿Te interesaría agendar una visita guiada a la obra para este sábado?` },
          { time: "0:37", speaker: `${lead.name} (Cliente)`, text: `Sí, me interesaría ir el sábado por la mañana, como a las 11:00 AM si es posible.` },
          { time: "0:43", speaker: "Nexor IA (Voz)", text: `Perfecto. Queda reservado tu espacio este sábado a las 11:00 AM en el showroom de preventa. Te enviaré un correo con el folleto digital y la ubicación de Google Maps. ¡Que tengas un excelente día!` }
        ];
        summary = {
          objective: `Consultar opciones de financiamiento y programar visita guiada`,
          result: `Visita reservada con éxito para el sábado a las 11:00 AM en sala de ventas`,
          sentiment: `Interesado y decidido 🎯`,
          action: `Preparar corrida financiera preliminar de preventa y enviarla por correo`
        };
      } else if (ind.includes("saas") || ind.includes("soft") || ind.includes("b2b")) {
        transcript = [
          { time: "0:04", speaker: "Nexor IA (Voz)", text: `¡Hola! Gracias por llamar a soporte comercial de ${companyName}. ¿Hablo con ${lead.name}?` },
          { time: "0:10", speaker: `${lead.name} (Cliente)`, text: `Hola, sí. Quería validar si su API de mensajería multiagente soporta integración nativa con HubSpot CRM.` },
          { time: "0:20", speaker: "Nexor IA (Voz)", text: `¡Hola, ${lead.name}! Sí, absolutamente. Contamos con un plugin oficial homologado para HubSpot que se conecta en 3 clics y sincroniza leads en tiempo real. ¿Te interesaría agendar una videollamada de demostración técnica de 10 minutos mañana por la tarde?` },
          { time: "0:38", speaker: `${lead.name} (Cliente)`, text: `Sí, mañana a las 3:00 PM me viene súper bien.` },
          { time: "0:44", speaker: "Nexor IA (Voz)", text: `Perfecto. He reservado la reunión para mañana a las 3:00 PM. Te acabo de enviar la invitación de Google Calendar al correo asociado. ¡Sigo a tus órdenes!` }
        ];
        summary = {
          objective: `Validación de compatibilidad técnica con CRM HubSpot`,
          result: `Demostración de pantalla compartida agendada para mañana a las 3:00 PM en Google Meet`,
          sentiment: `Profesional / Enfocado a detalles técnicos 💻`,
          action: `Asignar desarrollador de integraciones senior a la llamada de mañana`
        };
      } else {
        transcript = [
          { time: "0:05", speaker: "Nexor IA (Voz)", text: `¡Hola! Te comunicas con el centro de agendamientos automatizados de ${companyName}. ¿Hablo con ${lead.name}?` },
          { time: "0:11", speaker: `${lead.name} (Cliente)`, text: `Sí, hola. Quería consultar si tienen citas disponibles para una valoración de tratamiento este fin de semana.` },
          { time: "0:18", speaker: "Nexor IA (Voz)", text: `¡Hola! Sí, claro que sí. Contamos con espacios libres este sábado a las 10:00 AM o a la 1:00 PM para valoración médica gratuita. ¿Cuál prefieres agendar?` },
          { time: "0:29", speaker: `${lead.name} (Cliente)`, text: `Me queda excelente a las 10:00 AM de este sábado.` },
          { time: "0:34", speaker: "Nexor IA (Voz)", text: `¡Perfecto, ${lead.name}! Cita reservada para valoración este sábado a las 10:00 AM. Te mandamos la confirmación por WhatsApp en unos instantes. ¡Cuídate mucho!` }
        ];
        summary = {
          objective: `Reservar cita de valoración médica/estética`,
          result: `Cita confirmada para el sábado a las 10:00 AM en clínica principal`,
          sentiment: `Amigable y agradecido 😊`,
          action: `Enviar mensaje automático de confirmación con indicaciones de estacionamiento`
        };
      }

      return { transcript, summary };
    }

    return null;
  };

  const handleSendWhatsApp = (lead: SimulatedLead) => {
    if (!whatsappInput.trim() || isBotTypingWhatsApp) return;
    const leadId = lead.id;
    const userText = whatsappInput;
    setWhatsappInput("");

    const defaultChats = getChannelData(lead, "whatsapp") as { sender: "bot" | "lead"; text: string; time: string }[];
    const currentChats = customWhatsAppChats[leadId] || defaultChats;

    const updatedChats = [...currentChats, { sender: "lead" as const, text: userText, time: "Justo ahora" }];
    setCustomWhatsAppChats((prev) => ({
      ...prev,
      [leadId]: updatedChats
    }));

    setIsBotTypingWhatsApp(true);

    setTimeout(() => {
      let replyText = "";
      if (userText.toLowerCase().includes("precio") || userText.toLowerCase().includes("cuánto") || userText.toLowerCase().includes("costo") || userText.toLowerCase().includes("valor")) {
        replyText = `¡Claro! La cotización base para ${lead.productOfInterest || "nuestro servicio"} tiene excelentes planes de pago. Te los acabo de enviar adjuntos en PDF. ¿Te interesaría agendar una llamada de 5 minutos con un especialista hoy?`;
      } else if (userText.toLowerCase().includes("cita") || userText.toLowerCase().includes("reunión") || userText.toLowerCase().includes("agenda") || userText.toLowerCase().includes("visita")) {
        replyText = `¡Perfecto! El asistente virtual de Nexor puede bloquear un espacio en la agenda de la sucursal. ¿Te queda mejor hoy a las 5:00 PM o mañana por la mañana?`;
      } else {
        replyText = `Entendido. Registré tu consulta sobre "${userText}" para que el agente autónomo de ${activeProspectDetails?.company || "la empresa"} lo procese con prioridad. ¿Hay algo más en lo que te pueda asistir ahora mismo?`;
      }

      setCustomWhatsAppChats((prev) => ({
        ...prev,
        [leadId]: [...(prev[leadId] || updatedChats), { sender: "bot" as const, text: replyText, time: "Hace unos segundos" }]
      }));
      setIsBotTypingWhatsApp(false);
    }, 1200);
  };

  const handleSendInstagram = (lead: SimulatedLead) => {
    if (!instagramInput.trim() || isBotTypingInstagram) return;
    const leadId = lead.id;
    const userText = instagramInput;
    setInstagramInput("");

    const defaultChats = getChannelData(lead, "instagram") as { sender: "bot" | "lead"; text: string; time: string }[];
    const currentChats = customInstagramChats[leadId] || defaultChats;

    const updatedChats = [...currentChats, { sender: "lead" as const, text: userText, time: "Justo ahora" }];
    setCustomInstagramChats((prev) => ({
      ...prev,
      [leadId]: updatedChats
    }));

    setIsBotTypingInstagram(true);

    setTimeout(() => {
      let replyText = "";
      if (userText.toLowerCase().includes("precio") || userText.toLowerCase().includes("cuánto") || userText.toLowerCase().includes("costo")) {
        replyText = `¡Hola! Con gusto te compartimos los precios especiales por aquí por DM. El plan de preventa para ${lead.productOfInterest || "el producto"} tiene facilidades de pago increíbles. ¿Te interesa recibir el catálogo completo?`;
      } else {
        replyText = `¡Gracias por tu mensaje por Instagram Direct! 📸 Procesando tu duda de "${userText}". Un asesor comercial de ${activeProspectDetails?.company || "la empresa"} se pondrá en contacto pronto o puedes agendar directo.`;
      }

      setCustomInstagramChats((prev) => ({
        ...prev,
        [leadId]: [...(prev[leadId] || updatedChats), { sender: "bot" as const, text: replyText, time: "Hace unos segundos" }]
      }));
      setIsBotTypingInstagram(false);
    }, 1200);
  };

  return (
    <div className="space-y-8" id="crm-section">

      {/* VISTA DETALLE DE LEADS (KANBAN) */}
      {selectedProspectId && activeProspectDetails ? (
        <div className="space-y-6 animate-fade-in">

          {/* Sección de Volver a Cartera - Extraída arriba con separación del header */}
          <div className="pb-2">
            <button
              onClick={() => {
                setDetailTab("leads");
                if (readonlyMode && onBackToSharedList) {
                  onBackToSharedList();
                } else {
                  onClearSelection();
                  setSelectedLeadId(null);
                }
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-gray-950 cursor-pointer transition-colors bg-white hover:bg-gray-50 border border-gray-150 px-4 py-2.5 rounded-xl shadow-2xs"
              id="btn-back-to-portfolio"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-gray-400" />
              <span>{readonlyMode ? "← Volver a mis Dashboards Compartidos" : "Volver a la Cartera de Clientes"}</span>
            </button>
          </div>

          {/* NAVBAR INTERNO DEL CLIENTE: Leads, Alcancía, Invoices */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setDetailTab("leads")}
              className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${detailTab === "leads"
                  ? "border-neutral-900 text-neutral-950"
                  : "border-transparent text-gray-400 hover:text-gray-900"
                }`}
            >
              <Users className="h-4 w-4" />
              <span>Embudo & Leads</span>
            </button>
            <button
              onClick={() => setDetailTab("alcancia")}
              className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${detailTab === "alcancia"
                  ? "border-neutral-900 text-neutral-950"
                  : "border-transparent text-gray-400 hover:text-gray-900"
                }`}
            >
              <PiggyBank className="h-4 w-4" />
              <span>Alcancía de Leads</span>
              {activeProspectDetails.leadsBalance !== undefined && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeProspectDetails.leadsBalance > 5
                    ? "bg-emerald-100 text-emerald-800"
                    : activeProspectDetails.leadsBalance > 0
                      ? "bg-amber-100 text-amber-800 animate-pulse"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {activeProspectDetails.leadsBalance}
                </span>
              )}
            </button>
            <button
              onClick={() => setDetailTab("invoices")}
              className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${detailTab === "invoices"
                  ? "border-neutral-900 text-neutral-950"
                  : "border-transparent text-gray-400 hover:text-gray-900"
                }`}
            >
              <Receipt className="h-4 w-4" />
              <span>Historial Invoices</span>
              {activeProspectDetails.invoices && activeProspectDetails.invoices.filter((inv: any) => inv.status === "pending").length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                  {activeProspectDetails.invoices.filter((inv: any) => inv.status === "pending").length} pnd
                </span>
              )}
            </button>
          </div>

          {detailTab === "leads" && (
            <div className="space-y-6">
              {/* TABLERO KANBAN DE LEADS */}
              {!selectedLeadId && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4" id="kanban-board">
                    {[
                      { status: "nuevo", title: "Leads Nuevos", color: "bg-blue-100 text-blue-800 border-blue-200" },
                      { status: "caliente", title: "Leads Calientes", color: "bg-rose-100 text-rose-800 border-rose-200" },
                      { status: "humano", title: "Traspaso Humano", color: "bg-purple-100 text-purple-800 border-purple-200" },
                      { status: "cerrado", title: "Agendados / Cerrados", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
                      { status: "frio", title: "Leads Fríos", color: "bg-slate-100 text-slate-800 border-slate-200" }
                    ].map((column) => {
                      const currentLeads = leadsByProspect[selectedProspectId] || [];
                      const leadsInCol = currentLeads.filter(
                        (l) => l.status === column.status
                      );

                      return (
                        <div key={column.status} className="flex flex-col bg-gray-50/70 border border-gray-150 rounded-2xl p-3 min-h-[450px]">
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${column.color}`}>
                              {column.title}
                            </span>
                            <span className="text-xs font-mono font-bold text-gray-500 bg-white border border-gray-200 h-5 w-5 rounded-full flex items-center justify-center shadow-2xs">
                              {leadsInCol.length}
                            </span>
                          </div>

                          <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                            {leadsInCol.length === 0 ? (
                              <div className="flex items-center justify-center h-28 border border-dashed border-gray-200 rounded-xl">
                                <p className="text-[10px] text-gray-400 font-medium">Sin leads en esta etapa</p>
                              </div>
                            ) : (
                              leadsInCol.map((lead) => (
                                <div
                                  key={lead.id}
                                  onClick={() => {
                                    setSelectedLeadId(lead.id);
                                    setActiveChannelTab(lead.channel);
                                    setIsAudioPlaying(false);
                                    setAudioTime(0);
                                  }}
                                  className={`bg-white border rounded-xl p-3.5 space-y-2.5 shadow-2xs transition-all duration-300 text-left cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${lead.lastActive === "Justo ahora ⚡"
                                      ? "border-emerald-400 ring-1 ring-emerald-400/30 scale-[1.01]"
                                      : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <div>
                                      <p className="text-xs font-bold text-gray-900">{lead.name}</p>
                                      <p className="text-[9px] text-gray-400 font-semibold">{lead.phoneOrUser}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                      <span className={`inline-flex items-center space-x-1 border px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${getMessageDirection(lead.latestMessage) === "inbound"
                                          ? "bg-blue-50 text-blue-700 border-blue-100/70"
                                          : "bg-emerald-50 text-emerald-700 border-emerald-100/70"
                                        }`}>
                                        {renderChannelIcon(lead.channel, getMessageDirection(lead.latestMessage))}
                                        <span>
                                          {getChannelBadgeLabel(lead.channel, lead.latestMessage)}
                                        </span>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 space-y-1">
                                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Último contacto:</span>
                                    <p className="text-[10px] text-gray-700 leading-relaxed italic">
                                      "{lead.latestMessage}"
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold border-t border-gray-50 pt-2">
                                    <span className="flex items-center space-x-1">
                                      <Clock className="h-2.5 w-2.5 text-gray-400" />
                                      <span>{lead.lastActive}</span>
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CONSOLA DE SIMULACIÓN */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Panel de Control de la Simulación</h3>
                        <h4 className="text-base font-bold text-gray-950 mt-1">Simular comportamiento del Embudo</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Controla la velocidad del flujo de leads. Puedes forzar la entrada de nuevos leads o reiniciar el simulador.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setSimulationActive(!simulationActive)}
                          className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${simulationActive
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "bg-neutral-900 text-white hover:bg-neutral-800"
                            }`}
                          id="btn-toggle-simulation"
                        >
                          {simulationActive ? (
                            <>
                              <Pause className="h-3.5 w-3.5" />
                              <span>Pausar Simulación</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5" />
                              <span>Activar Simulación</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleForceNewLead}
                          className="inline-flex items-center space-x-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200 px-4 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          id="btn-force-lead"
                        >
                          <Plus className="h-3.5 w-3.5 text-neutral-900 animate-pulse" />
                          <span>Forzar Nuevo Lead</span>
                        </button>

                        <button
                          onClick={handleResetLeads}
                          className="inline-flex items-center space-x-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          id="btn-reset-leads"
                          title="Reiniciar leads por defecto"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reiniciar Leads</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ──────────────── LEAD DETAIL (inline, replaces drawer) ──────────────── */}
              {selectedLeadId && (() => {
                const currentLeads = leadsByProspect[selectedProspectId] || [];
                const activeLead = currentLeads.find((l) => l.id === selectedLeadId);
                if (!activeLead) {
                  setSelectedLeadId(null);
                  return null;
                }
                const activeLeadChannelData = getChannelData(activeLead, activeChannelTab);
                const pct = (() => {
                  if (activeLead.status === "cerrado") return 100;
                  if (activeLead.status === "caliente") return Math.floor(Math.random() * 30) + 55;
                  if (activeLead.status === "humano") return Math.floor(Math.random() * 30) + 40;
                  if (activeLead.status === "frio") return Math.floor(Math.random() * 20) + 5;
                  return Math.floor(Math.random() * 30) + 15;
                })();
                const stageLabels: Record<string, string> = { nuevo: "Nuevo", caliente: "Caliente", cerrado: "Cerrado", humano: "Con humano", frio: "Frío" };
                const stageColors: Record<string, { bg: string; text: string; border: string }> = {
                  nuevo: { bg: "#E0F2FE", text: "#0369A1", border: "#0284C7" },
                  caliente: { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
                  cerrado: { bg: "#D1FAE5", text: "#065F46", border: "#10B981" },
                  humano: { bg: "#E0E7FF", text: "#4338CA", border: "#6366F1" },
                  frio: { bg: "#F4F4F5", text: "#52525B", border: "#A1A1AA" },
                };
                const sc = stageColors[activeLead.status] || stageColors.nuevo;
                const amount = (() => {
                  const amounts = [28500, 41200, 22900, 19400, 26700];
                  const idx = activeLead.id.charCodeAt(activeLead.id.length - 1) % amounts.length;
                  return amounts[idx];
                })();
                const interest = activeLead.productOfInterest || "Servicio Nexor";

                const [leadTab, setLeadTab] = React.useState<"detalles" | "conversacion">("detalles");

                return (
                  <div className="space-y-4 animate-fade-in">
                    <button
                      onClick={() => { setSelectedLeadId(null); setIsAudioPlaying(false); setAudioTime(0); }}
                      className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-gray-950 cursor-pointer transition-colors bg-white hover:bg-gray-50 border border-gray-150 px-4 py-2.5 rounded-xl shadow-2xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 text-gray-400" />
                      <span>Volver al Embudo</span>
                    </button>

                    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-neutral-950 text-white flex items-center justify-center text-sm font-black uppercase flex-shrink-0">
                            {activeLead.name.substring(0, 2)}
                          </div>
                          <div>
                            <h2 className="text-xl font-black text-gray-900">{activeLead.name}</h2>
                            <p className="text-xs text-gray-400">
                              {activeLead.phoneOrUser} · {activeLead.channel === "whatsapp" ? "WhatsApp" : activeLead.channel === "instagram" ? "Instagram" : activeLead.channel === "email" ? "Email" : "Llamada"} · <span className="font-bold" style={{ color: sc.text }}>{stageLabels[activeLead.status]}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Valor estimado</span>
                          <span className="text-lg font-black font-mono text-gray-900">${amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex border-b border-gray-200 mt-4">
                        <button
                          onClick={() => setLeadTab("detalles")}
                          className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-bold text-xs transition-all cursor-pointer ${leadTab === "detalles"
                              ? "border-neutral-900 text-neutral-950"
                              : "border-transparent text-gray-400 hover:text-gray-900"
                            }`}
                        >
                          <Users className="h-4 w-4" />
                          <span>Detalles</span>
                        </button>
                        <button
                          onClick={() => setLeadTab("conversacion")}
                          className={`flex items-center space-x-2 py-3 px-5 border-b-2 font-bold text-xs transition-all cursor-pointer ${leadTab === "conversacion"
                              ? "border-neutral-900 text-neutral-950"
                              : "border-transparent text-gray-400 hover:text-gray-900"
                            }`}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Conversación</span>
                        </button>
                      </div>

                      {leadTab === "detalles" ? (
                        <div className="py-5 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Probabilidad de cierre</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-[#F0F0F2] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 70 ? "#10B981" : pct >= 40 ? "#F59E0B" : "#0284C7" }} />
                                </div>
                                <span className="text-lg font-black font-mono">{pct}%</span>
                              </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Producto de interés</p>
                              <p className="text-sm font-extrabold">{interest}</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Canal de origen</p>
                              <div className="flex items-center gap-1.5">
                                {renderChannelIcon(activeLead.channel, "inbound")}
                                <span className="text-sm font-extrabold capitalize">{activeLead.channel}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Estado actual</p>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                                {stageLabels[activeLead.status]}
                              </span>
                            </div>
                            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Último contacto</p>
                              <p className="text-sm font-extrabold">{activeLead.lastActive}</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Último mensaje</p>
                            <p className="text-sm text-gray-700 italic">"{activeLead.latestMessage}"</p>
                          </div>
                        </div>
                      ) : (
                        /* ── CONVERSACIÓN TAB ── */
                        <div className="py-4 space-y-4">
                          <div className="flex justify-start bg-gray-100 p-1 rounded-2xl border border-gray-200 w-fit">
                            {activeLead.channel === "whatsapp" && (
                              <button
                                onClick={() => { setActiveChannelTab("whatsapp"); setIsAudioPlaying(false); }}
                                className={`py-2 px-4 text-center rounded-xl text-[10px] font-black flex items-center space-x-1.5 transition-all cursor-pointer ${activeChannelTab === "whatsapp"
                                    ? "bg-white text-emerald-700 shadow-3xs"
                                    : "text-gray-500 hover:text-gray-900"
                                  }`}
                              >
                                <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                <span>WhatsApp</span>
                              </button>
                            )}
                            {activeLead.channel === "instagram" && (
                              <button
                                onClick={() => { setActiveChannelTab("instagram"); setIsAudioPlaying(false); }}
                                className={`py-2 px-4 text-center rounded-xl text-[10px] font-black flex items-center space-x-1.5 transition-all cursor-pointer ${activeChannelTab === "instagram"
                                    ? "bg-white text-rose-600 shadow-3xs"
                                    : "text-gray-500 hover:text-gray-900"
                                  }`}
                              >
                                <Instagram className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                                <span>Instagram</span>
                              </button>
                            )}
                            {activeLead.channel === "email" && (
                              <button
                                onClick={() => { setActiveChannelTab("email"); setIsAudioPlaying(false); }}
                                className={`py-2 px-4 text-center rounded-xl text-[10px] font-black flex items-center space-x-1.5 transition-all cursor-pointer ${activeChannelTab === "email"
                                    ? "bg-white text-blue-600 shadow-3xs"
                                    : "text-gray-500 hover:text-gray-900"
                                  }`}
                              >
                                <Mail className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                <span>Email</span>
                              </button>
                            )}
                            {activeLead.channel === "phone" && (
                              <button
                                onClick={() => { setActiveChannelTab("phone"); }}
                                className={`py-2 px-4 text-center rounded-xl text-[10px] font-black flex items-center space-x-1.5 transition-all cursor-pointer ${activeChannelTab === "phone"
                                    ? "bg-white text-violet-700 shadow-3xs"
                                    : "text-gray-500 hover:text-gray-900"
                                  }`}
                              >
                                <Phone className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
                                <span>Llamada IA</span>
                              </button>
                            )}
                          </div>

                          <div className="min-h-[400px]">
                            {activeChannelTab === "whatsapp" && (
                              <div className="space-y-4 flex flex-col h-full justify-between">
                                <div
                                  className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl border border-[#e3ded6] max-h-[500px] min-h-[420px] relative"
                                  style={{
                                    backgroundColor: "#efeae2",
                                    backgroundImage: "url('/whatsapp/fondo_chat.webp')",
                                    backgroundRepeat: "repeat",
                                    backgroundSize: "auto"
                                  }}
                                >
                                  <div className="bg-emerald-100/80 text-emerald-800 border border-emerald-200/50 p-2 rounded-xl text-[9px] font-bold text-center uppercase tracking-wider mx-auto max-w-[85%] shadow-3xs backdrop-blur-xs">
                                    Chat cifrado · Agente conversacional Nexor IA activo.
                                  </div>
                                  {(customWhatsAppChats[activeLead.id] || (activeLeadChannelData as any[])).map((msg, idx) => {
                                    const isBot = msg.sender === "bot";
                                    return (
                                      <div
                                        key={idx}
                                        className={`flex flex-col max-w-[78%] ${isBot ? "mr-auto items-start" : "ml-auto items-end"}`}
                                      >
                                        <div className={`p-3 rounded-xl text-xs leading-relaxed shadow-3xs relative ${isBot
                                            ? "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                                            : "bg-[#d9fdd3] text-gray-800 rounded-tr-none border border-[#c1f2b6]"
                                          }`}>
                                          <p className="whitespace-pre-wrap">
                                            {msg.text.split(/(\*[^*]+\*|_[^_]+_)/g).map((part, pIdx) => {
                                              if (part.startsWith("*") && part.endsWith("*")) {
                                                return <strong key={pIdx} className="font-extrabold">{part.slice(1, -1)}</strong>;
                                              }
                                              if (part.startsWith("_") && part.endsWith("_")) {
                                                return <em key={pIdx} className="italic">{part.slice(1, -1)}</em>;
                                              }
                                              return part;
                                            })}
                                          </p>
                                          <div className="flex justify-end items-center space-x-1 mt-1 text-[8px] text-gray-400 font-bold">
                                            <span>{msg.time}</span>
                                            {!isBot && <span className="text-emerald-500 font-bold text-[9px]">✓✓</span>}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {isBotTypingWhatsApp && (
                                    <div className="text-[10px] text-emerald-800 animate-pulse font-bold bg-[#d9fdd3] border border-[#c1f2b6] px-3.5 py-2 rounded-xl inline-block mr-auto shadow-3xs rounded-tl-none">
                                      <span>{activeProspectDetails?.company || "IA"} escribiendo...</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 pt-2 border-t border-gray-150 bg-gray-50 p-2.5 rounded-b-2xl">
                                  <div className="flex-1 flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-gray-200 shadow-3xs">
                                    <input
                                      type="text"
                                      value={whatsappInput}
                                      onChange={(e) => setWhatsappInput(e.target.value)}
                                      onKeyDown={(e) => e.key === "Enter" && handleSendWhatsApp(activeLead)}
                                      placeholder="Simular conversación de WhatsApp..."
                                      className="flex-1 text-xs outline-none bg-transparent"
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleSendWhatsApp(activeLead)}
                                    className="rounded-full bg-[#00a884] p-3 text-white hover:bg-[#06cf9c] transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center shrink-0"
                                  >
                                    <Send className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {activeChannelTab === "instagram" && (
                              <div className="space-y-4 flex flex-col h-full justify-between">
                                <div className="flex-1 overflow-y-auto space-y-3.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 max-h-[440px] min-h-[350px]">
                                  <div className="bg-gray-100 text-gray-500 p-2 rounded-xl text-[9px] font-bold text-center uppercase tracking-wider mx-auto max-w-[85%]">
                                    Instagram Direct Messages · Canal conectado a Nexor IA
                                  </div>
                                  {(customInstagramChats[activeLead.id] || (activeLeadChannelData as any[])).map((msg, idx) => {
                                    const isBot = msg.sender === "bot";
                                    return (
                                      <div
                                        key={idx}
                                        className={`flex flex-col max-w-[78%] ${isBot ? "mr-auto items-start" : "ml-auto items-end"}`}
                                      >
                                        <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-3xs ${isBot
                                            ? "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                                            : "bg-neutral-900 text-white rounded-tr-none"
                                          }`}>
                                          <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        <span className="text-[8px] text-gray-400 font-bold mt-1 px-1.5">{msg.time}</span>
                                      </div>
                                    );
                                  })}
                                  {isBotTypingInstagram && (
                                    <div className="text-[10px] text-rose-600 animate-pulse font-bold bg-white px-3 py-1.5 rounded-full inline-block mr-auto border border-rose-100">
                                      Respondiendo por Instagram Direct...
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                                  <input
                                    type="text"
                                    value={instagramInput}
                                    onChange={(e) => setInstagramInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendInstagram(activeLead)}
                                    placeholder="Escribe un mensaje para simular Instagram DM..."
                                    className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                                  />
                                  <button
                                    onClick={() => handleSendInstagram(activeLead)}
                                    className="rounded-full bg-rose-500 p-2.5 text-white hover:bg-rose-600 transition-colors active:scale-95 cursor-pointer"
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {activeChannelTab === "email" && (
                              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                {(() => {
                                  const mail = activeLeadChannelData as { subject: string; senderEmail: string; body: string; reply: string };
                                  return (
                                    <div className="space-y-4 text-left">
                                      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-3xs space-y-3">
                                        <div className="flex items-start justify-between border-b border-gray-100 pb-2.5">
                                          <div>
                                            <h5 className="text-xs font-black text-gray-900">{mail.subject}</h5>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                              De: <strong className="text-gray-700">{activeLead.name}</strong> &lt;{mail.senderEmail}&gt;
                                            </p>
                                          </div>
                                          <span className="text-[10px] text-gray-400 font-semibold bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">Inbound Email</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-3 rounded-xl border border-gray-100 font-mono text-[11px]">{mail.body}</p>
                                      </div>
                                      <div className="bg-blue-50/40 border border-blue-150 rounded-2xl p-4 shadow-3xs space-y-3 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl flex items-center space-x-1">
                                          <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                                          <span>Auto-Respuesta IA</span>
                                        </div>
                                        <div className="flex items-start justify-between border-b border-blue-100 pb-2.5">
                                          <div>
                                            <h5 className="text-xs font-black text-blue-900">Re: {mail.subject}</h5>
                                            <p className="text-[10px] text-blue-400 mt-1">
                                              De: <strong className="text-blue-800">Nexor Intelligent Agent</strong> &lt;ia-agent@{activeProspectDetails.company.toLowerCase().replace(/\s+/g, '')}.com&gt;
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-white/80 p-3 rounded-xl border border-blue-100/50 font-mono text-[11px]">{mail.reply}</p>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                            {activeChannelTab === "phone" && (
                              <div className="space-y-5 max-h-[500px] overflow-y-auto">
                                {(() => {
                                  const phoneData = activeLeadChannelData as { transcript: { time: string; speaker: string; text: string }[]; summary: { objective: string; result: string; sentiment: string; action: string } };
                                  return (
                                    <div className="space-y-5">
                                      <div className="space-y-3">
                                        <h5 className="text-sm font-black text-gray-900">Transcripción de llamada</h5>
                                        {phoneData.transcript.map((entry, idx) => (
                                          <div key={idx} className="bg-white border border-gray-150 rounded-xl p-3 space-y-1">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] font-bold" style={{ color: entry.speaker.includes("Nexor") ? "#10B981" : "#6366F1" }}>
                                                {entry.speaker}
                                              </span>
                                              <span className="text-[9px] text-gray-400 font-mono">{entry.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-700 leading-relaxed">{entry.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="bg-violet-50/40 border border-violet-100 rounded-2xl p-4 space-y-3">
                                        <div className="flex items-center space-x-2">
                                          <Sparkles className="h-4 w-4 text-violet-500" />
                                          <h5 className="text-xs font-black text-violet-900">Resumen de IA</h5>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                          <div>
                                            <p className="text-[10px] font-bold text-violet-400 uppercase">Objetivo</p>
                                            <p className="text-xs text-violet-900 font-semibold">{phoneData.summary.objective}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold text-violet-400 uppercase">Resultado</p>
                                            <p className="text-xs text-violet-900 font-semibold">{phoneData.summary.result}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold text-violet-400 uppercase">Sentimiento</p>
                                            <p className="text-xs text-violet-900 font-semibold">{phoneData.summary.sentiment}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold text-violet-400 uppercase">Acción</p>
                                            <p className="text-xs text-violet-900 font-semibold">{phoneData.summary.action}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <button
                                            onClick={() => { setIsAudioPlaying(!isAudioPlaying); if (!isAudioPlaying) setAudioTime(0); }}
                                            className="p-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
                                          >
                                            {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                          </button>
                                          <div>
                                            <p className="text-xs font-bold text-gray-900">Grabación de llamada</p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-violet-500 rounded-full transition-all duration-1000" style={{ width: `${(audioTime / 44) * 100}%` }} />
                                              </div>
                                              <span className="text-[10px] text-gray-400 font-mono">{audioTime}s / 44s</span>
                                            </div>
                                          </div>
                                        </div>
                                        <Volume2 className={`h-4 w-4 ${isAudioPlaying ? "text-violet-500 animate-pulse" : "text-gray-300"}`} />
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SECCIÓN 2: ALCANCÍA DE LEADS (PREPAGO) */}
          {detailTab === "alcancia" && (
            <div className="space-y-6 animate-fade-in" id="customer-alcancia-section">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">Usage</h2>

              {/* Grid de Métricas Bento - Estilo Premium DeepSeek */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Topped-up balance */}
                <div className="bg-[#1e1e24] text-white rounded-2xl p-6 relative overflow-hidden shadow-sm flex items-center justify-between h-[120px] group border border-neutral-800">
                  <div>
                    <div className="flex items-center space-x-1.5 text-neutral-400">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Topped-up balance</span>
                    </div>
                    <div className="pt-1.5 flex items-baseline space-x-1">
                      <span className="text-3xl font-black font-mono text-white">{activeProspectDetails.leadsBalance ?? 0}</span>
                      <span className="text-xs font-bold text-neutral-400 uppercase">Leads</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setRechargeLeadsAmount(50);
                      setCustomLeadsAmount("");
                      setShowRechargeModal(true);
                    }}
                    className="bg-white hover:bg-neutral-100 text-neutral-900 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer shadow-sm flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Top up</span>
                  </button>
                </div>

                {/* Total cost */}
                <div className="bg-[#1e1e24] text-white rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-center h-[120px] border border-neutral-800">
                  <div className="flex items-center space-x-1.5 text-neutral-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total cost</span>
                  </div>
                  <div className="pt-1.5 flex items-baseline space-x-1">
                    <span className="text-3xl font-black font-mono text-emerald-400">${activeProspectDetails.estimatedValue ?? 0}</span>
                    <span className="text-xs font-bold text-neutral-400 uppercase">USD</span>
                  </div>
                </div>

              </div>

              {/* Acceso a Recargas Rápidas */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Select Top-up Package</h3>
                  <p className="text-xs text-gray-400">Select a bundle to quickly create a pending invoice and copy its checkout link.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[20, 50, 100, 200].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setRechargeLeadsAmount(amount);
                        setCustomLeadsAmount("");
                        setShowRechargeModal(true);
                      }}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 transition-all text-center space-y-1 group cursor-pointer active:scale-95"
                    >
                      <p className="text-lg font-black text-neutral-900 font-mono">+{amount} Leads</p>
                      <p className="text-[10px] text-gray-400 group-hover:text-neutral-900 font-bold font-mono">${amount * 15} USD</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 3: HISTORIAL DE INVOICES (FACTURAS) */}
          {detailTab === "invoices" && (
            <div className="space-y-6 animate-fade-in" id="customer-invoices-section">
              {/* Tarjetas Bento de Resumen de Invoices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center space-x-3.5">
                  <div className="p-3 bg-white border border-gray-200 text-gray-700 rounded-xl">
                    <Receipt className="h-5 w-5 text-neutral-800" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Facturas Totales</p>
                    <p className="text-lg font-black text-gray-900 font-mono">
                      {activeProspectDetails.invoices?.length ?? 0}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 flex items-center space-x-3.5">
                  <div className="p-3 bg-white border border-emerald-150 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Facturas Pagadas</p>
                    <p className="text-lg font-black text-emerald-800 font-mono">
                      ${(activeProspectDetails.invoices?.filter(i => i.status === "Pagado").reduce((sum, i) => sum + i.amount, 0) ?? 0).toLocaleString()} USD
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 flex items-center space-x-3.5">
                  <div className="p-3 bg-white border border-amber-150 text-amber-600 rounded-xl">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase">Pendientes de Pago</p>
                    <p className="text-lg font-black text-amber-800 font-mono">
                      ${(activeProspectDetails.invoices?.filter(i => i.status === "Pendiente").reduce((sum, i) => sum + i.amount, 0) ?? 0).toLocaleString()} USD
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabla de Facturas */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">Listado de Facturas (Invoices)</h3>
                    <p className="text-xs text-gray-400">Control de pagos, recargas de leads y links de cobro para el cliente.</p>
                  </div>

                  {!readonlyMode && (
                    <button
                      onClick={() => {
                        setRechargeLeadsAmount(50);
                        setCustomLeadsAmount("");
                        setShowRechargeModal(true);
                      }}
                      className="inline-flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Nueva Factura</span>
                    </button>
                  )}
                </div>

                {(!activeProspectDetails.invoices || activeProspectDetails.invoices.length === 0) ? (
                  <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 animate-fade-in">
                    <p className="text-xs text-gray-400">Este cliente aún no registra facturas emitidas ni recargas de alcancía.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-150 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="py-3 px-3">Código / Fecha</th>
                          <th className="py-3 px-3">Concepto / Recarga</th>
                          <th className="py-3 px-3">Monto (USD)</th>
                          <th className="py-3 px-3">Estado</th>
                          <th className="py-3 px-3 text-right">Acciones de Cobro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {activeProspectDetails.invoices.slice().reverse().map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="py-3.5 px-3">
                              <p className="font-bold text-neutral-900 font-mono">{invoice.id}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Emitido: {invoice.date}</p>
                            </td>
                            <td className="py-3.5 px-3">
                              <p className="font-bold text-gray-800">{invoice.concept}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">+{invoice.leadsAmount} leads para la alcancía</p>
                            </td>
                            <td className="py-3.5 px-3 font-mono font-bold text-neutral-950">
                              ${invoice.amount} USD
                            </td>
                            <td className="py-3.5 px-3">
                              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${invoice.status === "Pagado"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800 animate-pulse"
                                }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${invoice.status === "Pagado" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                                <span>{invoice.status}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(invoice.paymentLink ?? "");
                                    setCopiedInvoiceId(invoice.id);
                                    setTimeout(() => setCopiedInvoiceId(null), 2000);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-neutral-900 hover:bg-neutral-50 text-[10px] font-bold transition-all text-neutral-700 hover:text-neutral-900 flex items-center space-x-1"
                                  title="Copiar Link de Pago"
                                >
                                  {copiedInvoiceId === invoice.id ? (
                                    <><Check className="h-3 w-3 text-emerald-500" /><span className="text-emerald-600">Copiado</span></>
                                  ) : (
                                    <><Copy className="h-3 w-3" /><span>Copiar Link</span></>
                                  )}
                                </button>

                                {invoice.status === "Pendiente" && !readonlyMode && onUpdateProspect && (
                                  <button
                                    onClick={async () => {
                                      // Simular pago: cambia el estado de la factura a 'Pagado' y suma los leads al balance
                                      const updatedInvoices = activeProspectDetails.invoices!.map(inv => {
                                        if (inv.id === invoice.id) {
                                          return { ...inv, status: "Pagado" as const };
                                        }
                                        return inv;
                                      });
                                      const newBalance = (activeProspectDetails.leadsBalance ?? 0) + invoice.leadsAmount;
                                      // Además incrementamos estimatedValue sumándole el valor de la recarga
                                      const newEstimatedValue = (activeProspectDetails.estimatedValue ?? 0) + invoice.amount;

                                      onUpdateProspect(activeProspectDetails.id, {
                                        invoices: updatedInvoices,
                                        leadsBalance: newBalance,
                                        estimatedValue: newEstimatedValue
                                      });
                                      alert(`¡Pago simulado con éxito! Se han abonado +${invoice.leadsAmount} leads a la alcancía del cliente y se han registrado $${invoice.amount} USD en la facturación real.`);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-[10px] font-bold transition-all"
                                  >
                                    Pagar Factura (Demo)
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div />
      )}

      {/* MODAL DE COMPARTIR ESTILO GOOGLE DRIVE */}
      {sharingProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-fade-in" id="share-dashboard-modal">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-150 text-neutral-800">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Compartir Dashboard</h3>
                  <p className="text-[11px] text-gray-400">Permite que tu cliente vea su embudo de leads e interacciones en tiempo real.</p>
                </div>
              </div>
              <button
                onClick={() => setSharingProspect(null)}
                className="p-1.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Enlace para copiar */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase">Enlace Compartido</label>
              <div className="flex items-center space-x-2 bg-neutral-50 border border-neutral-150 p-2.5 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent border-none text-xs font-medium text-gray-700 outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-neutral-900 hover:text-white border border-neutral-200 hover:border-neutral-900 text-xs font-bold transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Añadir Invitado */}
            <form onSubmit={handleAddEmail} className="space-y-2">
              <label htmlFor="share-email" className="block text-[11px] font-bold text-gray-400 uppercase">Añadir personas con acceso</label>
              <div className="flex items-center space-x-2">
                <input
                  id="share-email"
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoadingSharing}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 flex-shrink-0"
                >
                  <span>Dar Acceso</span>
                </button>
              </div>
            </form>

            {/* Personas con acceso */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-gray-400 uppercase pb-1 border-b border-gray-100">
                <Shield className="h-3.5 w-3.5" />
                <span>Personas con Acceso</span>
              </div>

              <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-1">
                {/* Propietario */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-7 w-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                      {currentUser?.email?.substring(0, 2).toUpperCase() || "ME"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{currentUser?.email || "Tú (Socio)"}</p>
                      <p className="text-[10px] text-gray-400">Propietario</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">Dueño</span>
                </div>

                {/* Invitados */}
                {sharedEmails.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic py-2">Ningún usuario externo añadido todavía. Introduce un correo arriba para permitir el acceso.</p>
                ) : (
                  sharedEmails.map((email) => (
                    <div key={email} className="flex items-center justify-between text-xs animate-fade-in">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-7 w-7 rounded-full bg-neutral-100 border border-neutral-150 text-neutral-800 flex items-center justify-center font-bold text-[10px]">
                          {email.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-700">{email}</p>
                          <p className="text-[10px] text-gray-400">Empresa Invitada</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        disabled={isLoadingSharing}
                        className="text-[10px] font-bold text-red-500 hover:text-white border border-red-100 hover:bg-red-500 hover:border-red-500 px-2 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Aviso de seguridad */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150/60 text-[10px] text-gray-500 flex items-start space-x-2">
              <Lock className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="leading-normal">
                Este enlace es privado y de alta seguridad. Los invitados deben iniciar sesión con la cuenta de Google correspondiente a su correo electrónico authorized para poder ver la simulación en tiempo real.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RECARGAS DE ALCANCÍA */}
      {showRechargeModal && activeProspectDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-fade-in" id="recharge-alcancia-modal">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 w-full max-w-md shadow-xl space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-900">Top up balance</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{activeProspectDetails.company} · ${rechargeLeadsAmount * 15} USD</p>
              </div>
              <button
                onClick={() => {
                  setShowRechargeModal(false);
                  setGeneratedPayUrl(null);
                  setTopupSuccess(false);
                  setTopupCopied(false);
                  setTopupMethod("link");
                }}
                className="p-1.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Package selector */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-gray-400 uppercase">Paquete de leads</label>
              <div className="grid grid-cols-2 gap-2">
                {[20, 50, 100, 200].map((pkg) => (
                  <button
                    key={pkg}
                    type="button"
                    onClick={() => {
                      setRechargeLeadsAmount(pkg);
                      setCustomLeadsAmount("");
                      setGeneratedPayUrl(null);
                      setTopupSuccess(false);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${rechargeLeadsAmount === pkg && !customLeadsAmount
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-gray-200 hover:bg-neutral-50 text-gray-700"
                      }`}
                  >
                    <p className="text-sm font-black font-mono">+{pkg} Leads</p>
                    <p className={`text-[10px] font-bold font-mono ${rechargeLeadsAmount === pkg && !customLeadsAmount ? "text-emerald-300" : "text-gray-400"}`}>
                      ${pkg * 15} USD
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad personalizada de leads"
                  value={customLeadsAmount}
                  onChange={(e) => {
                    setCustomLeadsAmount(e.target.value);
                    const num = parseInt(e.target.value);
                    if (num > 0) setRechargeLeadsAmount(num);
                    setGeneratedPayUrl(null);
                    setTopupSuccess(false);
                  }}
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none pr-14 font-mono"
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] font-bold text-gray-400 uppercase pointer-events-none">Leads</span>
              </div>
            </div>

            {/* Total summary */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-2xl border border-neutral-100">
              <span className="text-xs text-gray-500 font-bold">Total</span>
              <span className="text-lg font-black font-mono text-neutral-900">${rechargeLeadsAmount * 15} <span className="text-xs text-gray-400 font-bold">USD</span></span>
            </div>

            {/* Payment method tabs */}
            <div className="space-y-3">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => { setTopupMethod("link"); setTopupSuccess(false); setGeneratedPayUrl(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${topupMethod === "link" ? "bg-white text-neutral-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Generar Link de Pago</span>
                </button>
                <button
                  onClick={() => { setTopupMethod("card"); setTopupSuccess(false); setGeneratedPayUrl(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${topupMethod === "card" ? "bg-white text-neutral-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Pagar con Tarjeta</span>
                </button>
              </div>

              {/* TAB: Generate Payment Link */}
              {topupMethod === "link" && (
                <div className="space-y-3">
                  {!generatedPayUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpdateProspect) {
                          const paymentUrl = `https://nexor.ai/checkout/pay?client=${activeProspectDetails.id}&inv=${Date.now()}&amount=${rechargeLeadsAmount * 15}&leads=${rechargeLeadsAmount}`;
                          const newInvoice = {
                            id: "INV-" + Math.floor(100000 + Math.random() * 900000),
                            concept: `Compra de ${rechargeLeadsAmount} Leads Prepago`,
                            amount: rechargeLeadsAmount * 15,
                            leadsAmount: rechargeLeadsAmount,
                            date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                            status: "Pendiente" as const,
                            paymentLink: paymentUrl
                          };
                          onUpdateProspect(activeProspectDetails.id, {
                            invoices: [...(activeProspectDetails.invoices || []), newInvoice]
                          });
                          setGeneratedPayUrl(paymentUrl);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                    >
                      Generar Link de Pago
                    </button>
                  ) : (
                    <div className="space-y-2 animate-fade-in">
                      <p className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>Invoice creado como Pendiente · Comparte el link con el cliente</span>
                      </p>
                      <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                        <input
                          type="text"
                          readOnly
                          value={generatedPayUrl}
                          className="flex-1 bg-transparent text-[10px] font-mono text-gray-700 outline-none select-all truncate"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPayUrl);
                            setTopupCopied(true);
                            setTimeout(() => setTopupCopied(false), 2000);
                          }}
                          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-[10px] font-black text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer flex items-center space-x-1"
                        >
                          {topupCopied ? <><Check className="h-3 w-3" /><span>Copiado</span></> : <><Copy className="h-3 w-3" /><span>Copiar</span></>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Card payment (simulated) */}
              {topupMethod === "card" && (
                <div className="space-y-3">
                  {!topupSuccess ? (
                    <>
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Número de tarjeta"
                            maxLength={19}
                            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-mono focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM / AA"
                            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-mono focus:border-neutral-900 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            maxLength={4}
                            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-mono focus:border-neutral-900 outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdateProspect) {
                            const paymentUrl = `https://nexor.ai/checkout/pay?client=${activeProspectDetails.id}&inv=${Date.now()}`;
                            const newInvoice = {
                              id: "INV-" + Math.floor(100000 + Math.random() * 900000),
                              concept: `Compra de ${rechargeLeadsAmount} Leads Prepago`,
                              amount: rechargeLeadsAmount * 15,
                              leadsAmount: rechargeLeadsAmount,
                              date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                              status: "Pagado" as const,
                              paymentLink: paymentUrl
                            };
                            const newBalance = (activeProspectDetails.leadsBalance ?? 0) + rechargeLeadsAmount;
                            const newEstimatedValue = (activeProspectDetails.estimatedValue ?? 0) + (rechargeLeadsAmount * 15);
                            onUpdateProspect(activeProspectDetails.id, {
                              invoices: [...(activeProspectDetails.invoices || []), newInvoice],
                              leadsBalance: newBalance,
                              estimatedValue: newEstimatedValue
                            });
                            setTopupSuccess(true);
                          }
                        }}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm"
                      >
                        Pagar ${rechargeLeadsAmount * 15} USD
                      </button>
                    </>
                  ) : (
                    <div className="py-6 flex flex-col items-center space-y-3 animate-fade-in">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-gray-900">¡Pago exitoso!</p>
                        <p className="text-xs text-gray-500 mt-1">Se añadieron +{rechargeLeadsAmount} leads al balance de {activeProspectDetails.company}.</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowRechargeModal(false);
                          setTopupSuccess(false);
                          setTopupMethod("link");
                        }}
                        className="mt-2 px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                      >
                        Cerrar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
