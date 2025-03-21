import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

export const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
  { name: "Setting", href: "/dashboard/setting", icon: Cog6ToothIcon },
];
