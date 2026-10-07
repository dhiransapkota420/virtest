import type { ListItem } from '../types';

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Riley', 'Avery',
  'Cameron', 'Dakota', 'Quinn', 'Skyler', 'Jesse', 'Reese', 'Rowan', 'Finley',
  'Charlie', 'Emerson', 'Hayden', 'Kai', 'Parker', 'Peyton', 'Sawyer', 'Eden'
];

const LAST_NAMES = [
  'Chen', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez'
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'DevOps', 'Data Science', 'Security', 'Customer Success'
];

const ROLES = [
  'Frontend Engineer', 'Senior Architect', 'UI/UX Designer', 'Product Manager',
  'Backend Developer', 'Data Analyst', 'DevOps Specialist', 'QA Engineer', 'Tech Lead'
];

const STATUSES: ListItem['status'][] = ['active', 'offline', 'busy', 'away'];

const AVATAR_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'
];

export function generateItems(count: number): ListItem[] {
  const items: ListItem[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const department = DEPARTMENTS[(i * 3) % DEPARTMENTS.length];
    const role = ROLES[(i * 5) % ROLES.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 50 ? i : ''}@company.io`;
    const status = STATUSES[(i * 11) % STATUSES.length];
    const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

    items[i] = {
      id: i + 1,
      name,
      role,
      department,
      email,
      status,
      avatarColor,
    };
  }
  return items;
}
