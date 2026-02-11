
export interface BuildingBlock {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
}

export const buildingBlocks: BuildingBlock[] = [
  {
    id: "ed",
    name: "Educator (AKA ED)",
    description: "A composite building block which enables learning & capacity building use cases in multiple domains such as Education, Agriculture, Healthcare, etc.",
    category: "Learning",
    imageUrl: "https://sunbird.org/images/2023/08/18/Educator-Icon.png"
  },
  {
    id: "knowlg",
    name: "Librarian (AKA Knowlg)",
    description: "A set of tools and services that enable you to create, curate, publish, organize and discover learning resources. It can also enable recommendations for better business outcomes.",
    category: "Learning",
    imageUrl: "https://sunbird.org/images/2023/08/14/librarian.svg"
  },
  {
    id: "lern",
    name: "Learner (AKA Lern)",
    description: "A set of services and tools for managing learning interactions of users. It enables learning journeys of a user. It also enables collaboration through groups, discussion forums etc.",
    category: "Learning",
    imageUrl: "https://sunbird.org/images/2023/08/14/learner.svg"
  },
  {
    id: "obsrv",
    name: "Observer (AKA Obsrv)",
    description: "Enables observability by empowering systems to stream, process, store and analyze telemetry data. Designed to help almost any system become “intelligent” by enabling flexible measurability.",
    category: "Data",
    imageUrl: "https://sunbird.org/images/2023/08/14/obeserver.svg"
  },
  {
    id: "inquiry",
    name: "Examiner (AKA inQuiry)",
    description: "A set of tools to create and manage question banks with a variety of questions. It enables creation of Worksheets, Assessments, Exam Papers, Quizzes, Surveys etc. in a quick and easy way.",
    category: "Learning",
    imageUrl: "https://sunbird.org/images/2023/08/14/examiner.svg"
  },
  {
    id: "rc",
    name: "Authenticator (AKA RC)",
    description: "SB RC is a building block that allows for rapid building and deployment of electronic registries through configurable schemas and workflows. It provides microservices for credential issuance and management.",
    category: "Trust & Identity",
    imageUrl: "https://sunbird.org/images/2023/08/14/authenticator.svg"
  },
  {
    id: "quml",
    name: "Quizmaster (AKA QuML)",
    description: "Systematize question banks, easy to store, render and distribute questions so that they can be reused across systems, independent of authoring tools.",
    category: "Learning",
    imageUrl: "https://sunbird.org/images/2023/08/14/quizmaster.svg"
  },
  {
    id: "saral",
    name: "Digitiser (AKA Saral)",
    description: "An application that can digitize data that is on physical printed sheets. It provides a simple way of capturing structured information on a paper into digital format through a scan.",
    category: "Trust & Identity",
    imageUrl: "https://sunbird.org/images/2023/08/14/digitiser.svg"
  }
];
