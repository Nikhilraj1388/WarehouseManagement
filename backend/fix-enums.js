const fs = require('fs');
const glob = require('glob');

const replaceInFiles = (pattern, replacements) => {
  const files = glob.sync(pattern);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace Prisma enum imports
    content = content.replace(/import {([^}]*)} from '@prisma\/client';/g, (match, p1) => {
      const parts = p1.split(',').map(p => p.trim());
      const filtered = parts.filter(p => p === 'PrismaClient');
      if (filtered.length === 0) return "import { PrismaClient } from '@prisma/client';";
      return `import { PrismaClient } from '@prisma/client';`;
    });

    // Replace usages
    content = content.replace(/Role\.ADMIN/g, "'ADMIN'");
    content = content.replace(/Role\.SALES/g, "'SALES'");
    content = content.replace(/Role\.WAREHOUSE/g, "'WAREHOUSE'");
    content = content.replace(/Role\.ACCOUNTS/g, "'ACCOUNTS'");
    content = content.replace(/CustomerType\.WHOLESALE/g, "'WHOLESALE'");
    content = content.replace(/CustomerStatus\.ACTIVE/g, "'ACTIVE'");
    content = content.replace(/MovementType\.IN/g, "'IN'");
    content = content.replace(/MovementType\.OUT/g, "'OUT'");
    
    // Express Request Type
    content = content.replace(/role: Role;/g, "role: string;");
    content = content.replace(/role: Role }/g, "role: string }");
    content = content.replace(/roles: Role\[\]/g, "roles: string[]");

    // Validators
    content = content.replace(/z\.nativeEnum\(CustomerType\)/g, "z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR'])");
    content = content.replace(/z\.nativeEnum\(CustomerStatus\)/g, "z.enum(['LEAD', 'ACTIVE', 'INACTIVE'])");
    content = content.replace(/z\.nativeEnum\(ChallanStatus\)/g, "z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED'])");

    // Types
    content = content.replace(/status: string as CustomerStatus;/g, "status: status;");
    content = content.replace(/status as CustomerStatus/g, "status as string");
    content = content.replace(/status as ChallanStatus/g, "status as string");
    content = content.replace(/status: ChallanStatus/g, "status: string");

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
    }
  });
};

replaceInFiles('src/**/*.ts');
replaceInFiles('prisma/**/*.ts');
