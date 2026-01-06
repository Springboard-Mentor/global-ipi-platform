export const mockFilings = [
  {
    id: 1,
    title: "Smart Home Security System",
    applicationNumber: "US20240001234",
    type: "Patent",
    jurisdiction: "US",
    status: "Granted",
    filingDate: "2023-01-15",
    grantDate: "2024-01-15",
    expiryDate: "2044-01-15",
    alertEnabled: true,
    timeline: [
      { status: "Filed", date: "2023-01-15" },
      { status: "Under Examination", date: "2023-06-15" },
      { status: "Granted", date: "2024-01-15" }
    ]
  },
  {
    id: 2,
    title: "AI Analytics Platform",
    applicationNumber: "US20240001235",
    type: "Patent",
    jurisdiction: "US",
    status: "Under Examination",
    filingDate: "2023-08-20",
    expiryDate: "2043-08-20",
    alertEnabled: false,
    timeline: [
      { status: "Filed", date: "2023-08-20" },
      { status: "Under Examination", date: "2024-02-20" }
    ]
  },
  {
    id: 3,
    title: "TechCorp Logo",
    applicationNumber: "US87654321",
    type: "Trademark",
    jurisdiction: "US",
    status: "Granted",
    filingDate: "2022-05-10",
    grantDate: "2023-05-10",
    expiryDate: "2025-05-10",
    alertEnabled: true,
    timeline: [
      { status: "Filed", date: "2022-05-10" },
      { status: "Granted", date: "2023-05-10" }
    ]
  },
  {
    id: 4,
    title: "Mobile Interface Design",
    applicationNumber: "US30123456",
    type: "Design",
    jurisdiction: "US",
    status: "Expired",
    filingDate: "2019-03-01",
    grantDate: "2020-03-01",
    expiryDate: "2024-03-01",
    alertEnabled: false,
    timeline: [
      { status: "Filed", date: "2019-03-01" },
      { status: "Granted", date: "2020-03-01" },
      { status: "Expired", date: "2024-03-01" }
    ]
  }
];