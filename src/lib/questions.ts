// Original practice questions written from the public AZ-900 skills outline.
// To extend: append objects to QUESTIONS with a unique id.

export type DomainId = "cloud" | "architecture" | "governance";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  domain: DomainId;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  options: [string, string, string, string];
  answer: number; // index into options
  explanation: string;
}

export const DOMAINS: { id: DomainId; name: string; weight: string; learnUrl: string; objectives: string[] }[] = [
  {
    id: "cloud",
    name: "Cloud concepts",
    weight: "25–30%",
    learnUrl: "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
    objectives: [
      "Define cloud computing and the shared responsibility model",
      "Compare public, private and hybrid cloud models",
      "Describe the consumption-based model and pricing",
      "Explain high availability, scalability, reliability and predictability",
      "Describe security, governance and manageability benefits",
      "Compare IaaS, PaaS and SaaS and identify use cases",
    ],
  },
  {
    id: "architecture",
    name: "Azure architecture & services",
    weight: "35–40%",
    learnUrl: "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/",
    objectives: [
      "Describe regions, region pairs, sovereign regions and availability zones",
      "Describe resources, resource groups, subscriptions and management groups",
      "Compare compute options: VMs, containers, functions, App Service",
      "Describe virtual networks, VPN Gateway, ExpressRoute and DNS",
      "Compare storage services, tiers and redundancy options",
      "Describe identity, access and security: Entra ID, MFA, Conditional Access, Zero Trust, Defender for Cloud",
    ],
  },
  {
    id: "governance",
    name: "Management & governance",
    weight: "30–35%",
    learnUrl: "https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/",
    objectives: [
      "Describe factors that affect cost, the pricing and TCO calculators and tags",
      "Describe Azure Policy, resource locks and Microsoft Purview",
      "Describe the portal, Cloud Shell, CLI, PowerShell, Azure Arc and ARM templates",
      "Describe Azure Advisor, Service Health and Azure Monitor",
    ],
  },
];

export const domainName = (d: DomainId) => DOMAINS.find((x) => x.id === d)!.name;

const q = (
  id: string, domain: DomainId, topic: string, difficulty: Difficulty,
  prompt: string, options: [string, string, string, string], answer: number, explanation: string,
): Question => ({ id, domain, topic, difficulty, prompt, options, answer, explanation });

export const QUESTIONS: Question[] = [
  // ---- Cloud concepts ----
  q("c1", "cloud", "Shared responsibility", "easy",
    "A team moves its app from its own server room to virtual machines in the cloud. Who is now responsible for patching the guest operating system?",
    ["The cloud provider", "The customer", "Both equally, by contract", "Nobody — VMs patch themselves"], 1,
    "With IaaS, the provider manages physical hardware and the hypervisor, but the customer still manages the guest OS, apps and data."),
  q("c2", "cloud", "Shared responsibility", "medium",
    "Which responsibility always stays with the customer, whatever service type they use?",
    ["Physical datacentre security", "Network hardware maintenance", "Their data, accounts and identities", "Host operating system updates"], 2,
    "Information, data, devices, accounts and identities remain the customer's responsibility across IaaS, PaaS and SaaS."),
  q("c3", "cloud", "Cloud models", "easy",
    "A hospital keeps patient records on its own infrastructure but bursts its public website to a cloud provider during busy periods. Which model is this?",
    ["Public cloud", "Private cloud", "Hybrid cloud", "Community hosting"], 2,
    "Combining private infrastructure with public cloud resources that work together is a hybrid cloud."),
  q("c4", "cloud", "Cloud models", "medium",
    "Which statement best describes a private cloud?",
    ["Resources are shared by many organisations over the internet", "Resources are used exclusively by one organisation", "It never uses virtualisation", "It is always cheaper than public cloud"], 1,
    "A private cloud is dedicated to a single organisation, whether hosted on-premises or by a third party."),
  q("c5", "cloud", "Consumption-based pricing", "easy",
    "A start-up only wants to pay for compute while its batch job actually runs. Which cloud benefit does this describe?",
    ["Capital expenditure", "Consumption-based model", "Fixed licensing", "Reserved datacentre space"], 1,
    "The consumption-based model means you pay only for the resources you use, with no upfront hardware cost."),
  q("c6", "cloud", "Consumption-based pricing", "medium",
    "Buying physical servers for a new datacentre is an example of which kind of spending?",
    ["Operational expenditure (OpEx)", "Capital expenditure (CapEx)", "Consumption expenditure", "Elastic expenditure"], 1,
    "CapEx is up-front spending on physical infrastructure. Cloud services usually shift spending to OpEx."),
  q("c7", "cloud", "Cloud benefits", "easy",
    "An online shop automatically adds web servers on Black Friday and removes them afterwards. Which benefit is this?",
    ["Predictability", "Elasticity / scalability", "Governance", "Sovereignty"], 1,
    "Adding and removing resources to match demand is scalability; doing it automatically is often called elasticity."),
  q("c8", "cloud", "Cloud benefits", "medium",
    "What is the difference between vertical and horizontal scaling?",
    ["Vertical adds more instances; horizontal adds CPU/RAM", "Vertical adds CPU/RAM to one instance; horizontal adds more instances", "They are the same thing", "Vertical is only for storage"], 1,
    "Scaling up (vertical) makes a resource bigger; scaling out (horizontal) adds more resources."),
  q("c9", "cloud", "Cloud benefits", "medium",
    "A service-level agreement promises 99.95% uptime for a service. Which cloud benefit is this most directly related to?",
    ["High availability", "Manageability", "Consumption-based pricing", "Elasticity"], 0,
    "High availability is about keeping a service accessible; SLAs describe the uptime guarantee."),
  q("c10", "cloud", "Service types", "easy",
    "A company uses a hosted email product and only manages its users and settings. Which service type is this?",
    ["IaaS", "PaaS", "SaaS", "On-premises"], 2,
    "Software as a Service gives you a complete application; the provider manages almost everything else."),
  q("c11", "cloud", "Service types", "medium",
    "Developers want to deploy code without managing operating systems or web servers. Which service type fits best?",
    ["IaaS", "PaaS", "SaaS", "Bare metal"], 1,
    "PaaS provides a managed platform so developers focus on their application code and data."),
  q("c12", "cloud", "Service types", "hard",
    "A team must install a custom kernel driver required by legacy software. Which service type do they need?",
    ["SaaS", "PaaS", "IaaS", "Serverless functions"], 2,
    "Only IaaS gives control over the operating system, which is needed for custom drivers."),

  // ---- Architecture & services ----
  q("a1", "architecture", "Regions & availability zones", "easy",
    "What is an availability zone?",
    ["A billing boundary for subscriptions", "A physically separate datacentre location within a region", "A country where a service is sold", "A virtual network subnet"], 1,
    "Availability zones are physically separate locations within a region, each with independent power, cooling and networking."),
  q("a2", "architecture", "Regions & availability zones", "medium",
    "Why are most regions paired with another region in the same geography?",
    ["To double storage capacity for free", "To support disaster recovery and staggered platform updates", "To merge billing across countries", "To let VMs share memory"], 1,
    "Region pairs help with replication and recovery, and platform updates are rolled out to one region in a pair at a time."),
  q("a3", "architecture", "Regions & availability zones", "hard",
    "A government agency needs cloud infrastructure that is isolated from the main public cloud for compliance reasons. What should it look at?",
    ["Availability sets", "Sovereign regions", "Resource locks", "Management groups"], 1,
    "Sovereign regions are separate instances of the cloud for legal or compliance isolation, such as government clouds."),
  q("a4", "architecture", "Resource hierarchy", "easy",
    "Which is the correct order from largest scope to smallest?",
    ["Resource group → Subscription → Management group → Resource", "Management group → Subscription → Resource group → Resource", "Subscription → Management group → Resource → Resource group", "Resource → Resource group → Subscription → Management group"], 1,
    "Management groups contain subscriptions, which contain resource groups, which contain resources."),
  q("a5", "architecture", "Resource hierarchy", "medium",
    "What happens to the resources inside a resource group when the resource group is deleted?",
    ["They move to the default group", "They are deleted too", "They keep running but lose their tags", "Only VMs are deleted"], 1,
    "Deleting a resource group deletes every resource it contains, so groups are useful for lifecycle management."),
  q("a6", "architecture", "Compute", "easy",
    "A team wants to run a small piece of code every time a file lands in storage, paying only per execution. Which service fits?",
    ["Virtual Machines", "Azure Functions", "Virtual Desktop", "ExpressRoute"], 1,
    "Functions is serverless, event-driven compute billed per execution."),
  q("a7", "architecture", "Compute", "medium",
    "Which option packages an app with its dependencies and starts much faster than a full virtual machine?",
    ["Containers", "Availability zones", "Blob storage", "Resource groups"], 0,
    "Containers share the host OS kernel, making them lightweight and quick to start compared with VMs."),
  q("a8", "architecture", "Compute", "medium",
    "Which service hosts web apps and APIs as a managed platform with built-in scaling and deployment slots?",
    ["App Service", "Virtual Network", "Azure Files", "Microsoft Purview"], 0,
    "App Service is a PaaS offering for hosting web applications, REST APIs and mobile back ends."),
  q("a9", "architecture", "Networking", "medium",
    "A company needs a private, dedicated connection from its datacentre to the cloud that does not go over the public internet. What should it use?",
    ["VPN Gateway", "ExpressRoute", "Public DNS", "Network peering"], 1,
    "ExpressRoute provides private connectivity through a connectivity provider rather than the public internet."),
  q("a10", "architecture", "Networking", "easy",
    "What does virtual network peering allow?",
    ["Resources in two virtual networks to communicate privately", "Sharing a subscription between tenants", "Encrypting blob storage", "Replicating VMs to another region"], 0,
    "Peering connects virtual networks so resources can communicate using private IP addresses."),
  q("a11", "architecture", "Storage", "easy",
    "Which storage service is best suited to large amounts of unstructured data such as images and video?",
    ["Queue storage", "Blob storage", "Table storage", "Disk storage"], 1,
    "Blob storage is designed for massive amounts of unstructured object data."),
  q("a12", "architecture", "Storage", "medium",
    "Backups are kept for years and rarely read. Which access tier gives the lowest storage cost?",
    ["Hot", "Cool", "Cold", "Archive"], 3,
    "The archive tier has the lowest storage cost but the highest retrieval cost and latency."),
  q("a13", "architecture", "Storage", "hard",
    "Which redundancy option keeps copies across availability zones in the primary region and also replicates to a secondary region?",
    ["LRS", "ZRS", "GRS", "GZRS"], 3,
    "Geo-zone-redundant storage combines zone redundancy in the primary region with replication to a secondary region."),
  q("a14", "architecture", "Identity & security", "easy",
    "Requiring a password plus a code from a phone app is an example of what?",
    ["Single sign-on", "Multifactor authentication", "Role-based access control", "Conditional Access"], 1,
    "MFA requires two or more types of evidence to verify identity."),
  q("a15", "architecture", "Identity & security", "medium",
    "Which principle says to never trust a request by default and to verify every access explicitly?",
    ["Defence in depth", "Zero Trust", "Least cost", "Shared responsibility"], 1,
    "Zero Trust assumes breach and verifies each request explicitly, using least-privilege access."),
  q("a16", "architecture", "Identity & security", "medium",
    "An admin wants to block sign-ins from unfamiliar countries unless MFA is completed. Which feature fits?",
    ["Resource locks", "Conditional Access", "Azure Advisor", "Blob versioning"], 1,
    "Conditional Access uses signals like location and device to decide whether to allow, block or challenge sign-ins."),

  // ---- Management & governance ----
  q("g1", "governance", "Cost management", "easy",
    "Which tool estimates the monthly cost of services you plan to deploy?",
    ["Pricing calculator", "Service Health", "Azure Policy", "Cloud Shell"], 0,
    "The pricing calculator estimates the cost of provisioning cloud resources."),
  q("g2", "governance", "Cost management", "medium",
    "Which tool compares the cost of running workloads on-premises versus in the cloud?",
    ["Pricing calculator", "TCO calculator", "Azure Monitor", "Microsoft Purview"], 1,
    "The Total Cost of Ownership calculator compares on-premises infrastructure costs with the cloud."),
  q("g3", "governance", "Cost management", "medium",
    "Finance wants to see costs split by department. What is the simplest way to label resources for this?",
    ["Resource locks", "Tags", "Availability zones", "Region pairs"], 1,
    "Tags are name/value pairs that help organise resources and group costs in reports."),
  q("g4", "governance", "Policy & locks", "easy",
    "Which feature can prevent anyone from creating resources outside approved regions?",
    ["Azure Policy", "Azure Advisor", "Tags", "Cost alerts"], 0,
    "Azure Policy evaluates resources against rules and can deny non-compliant deployments."),
  q("g5", "governance", "Policy & locks", "medium",
    "A production database must never be deleted by accident, but it must still be updatable. Which lock fits?",
    ["ReadOnly", "CanNotDelete (Delete)", "Archive", "No lock — use tags"], 1,
    "A Delete lock allows reads and modifications but blocks deletion."),
  q("g6", "governance", "Policy & locks", "hard",
    "Which service helps discover, classify and govern data across on-premises, multicloud and SaaS sources?",
    ["Microsoft Purview", "Azure Arc", "Service Health", "ExpressRoute"], 0,
    "Purview provides data governance, cataloguing and risk and compliance capabilities."),
  q("g7", "governance", "Deployment tools", "easy",
    "Which tool gives you a browser-based command line already authenticated to your account?",
    ["Cloud Shell", "TCO calculator", "Azure Arc", "Policy"], 0,
    "Cloud Shell is a browser-accessible shell that supports both Bash and PowerShell."),
  q("g8", "governance", "Deployment tools", "medium",
    "A team wants to deploy the same environment repeatedly from a declarative file. What should it use?",
    ["ARM templates or Bicep", "Resource locks", "Azure Advisor", "Manual portal clicks"], 0,
    "Infrastructure as code with ARM templates or Bicep deploys resources consistently and repeatably."),
  q("g9", "governance", "Deployment tools", "hard",
    "A company wants to manage servers running in another cloud provider using the same governance tools. Which service extends management to them?",
    ["Azure Arc", "ExpressRoute", "Availability sets", "Blob lifecycle"], 0,
    "Azure Arc extends Azure management and governance to resources outside Azure."),
  q("g10", "governance", "Monitoring", "easy",
    "Which service gives personalised recommendations to improve cost, security, reliability and performance?",
    ["Azure Advisor", "Azure Arc", "Cloud Shell", "Purview"], 0,
    "Advisor analyses your resources and suggests improvements."),
  q("g11", "governance", "Monitoring", "medium",
    "Where would you check whether an ongoing platform outage is affecting your resources?",
    ["Service Health", "Pricing calculator", "Tags", "Resource locks"], 0,
    "Service Health reports service issues, planned maintenance and health advisories relevant to your resources."),
  q("g12", "governance", "Monitoring", "medium",
    "Which service collects metrics and logs and can raise alerts when a VM's CPU stays high?",
    ["Azure Monitor", "Azure Policy", "Microsoft Entra ID", "TCO calculator"], 0,
    "Azure Monitor collects, analyses and acts on telemetry, including alerts and Log Analytics queries."),
];

/** Fisher-Yates shuffle, no repeats within a session. */
export function pickQuestions(domain: DomainId | "all", count: number, topics?: string[], rand = Math.random): Question[] {
  let pool = QUESTIONS.filter((x) => (domain === "all" || x.domain === domain) && (!topics?.length || topics.includes(x.topic)));
  pool = [...pool];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = pool[i]!; pool[i] = pool[j]!; pool[j] = t;
  }
  return pool.slice(0, count);
}

export const getQuestion = (id: string) => QUESTIONS.find((x) => x.id === id);
