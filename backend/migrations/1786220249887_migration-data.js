export const up = (pgm) => {
  pgm.sql(`
    CREATE TYPE users_role_enum AS ENUM ('ADMIN', 'SALESPERSON');
    CREATE TYPE medicine_batches_status_enum AS ENUM ('ACTIVE', 'EXPIRED');
  `);

  pgm.sql(`
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role users_role_enum NOT NULL DEFAULT 'SALESPERSON',
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `);

  pgm.sql(`
    CREATE TABLE customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "fullName" TEXT NOT NULL,
        phone TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        address TEXT NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        sales_person_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  pgm.sql(`
    CREATE TABLE medicines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "medicineName" TEXT NOT NULL,
        composition TEXT,
        "medicineType" TEXT,
        "imageUrl" TEXT,
        price NUMERIC NOT NULL,
        "prescriptionRequired" BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `);

  pgm.sql(`
    CREATE TABLE medicine_batches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "purchasePrice" NUMERIC NOT NULL,
        "sellingPrice" NUMERIC NOT NULL,
        "discountPercent" NUMERIC NOT NULL,
        quantity INTEGER NOT NULL,
        "availableQuantity" INTEGER NOT NULL,
        "expiryDate" DATE NOT NULL,
        status medicine_batches_status_enum NOT NULL DEFAULT 'ACTIVE',
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
        medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  pgm.sql(`
    CREATE TABLE notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "medicineId" VARCHAR,
        "batchId" TEXT NOT NULL
    );
  `);

  pgm.sql(`
    CREATE TABLE sales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "invoiceNumber" TEXT NOT NULL UNIQUE,
        "totalAmount" NUMERIC NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
        sales_person_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  pgm.sql(`
    CREATE TABLE sale_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quantity INTEGER NOT NULL,
        "unitPrice" NUMERIC NOT NULL,
        sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
        batch_id UUID REFERENCES medicine_batches(id) ON DELETE SET NULL
    );
  `);
}

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS sale_items CASCADE;
    DROP TABLE IF EXISTS sales CASCADE;
    DROP TABLE IF EXISTS notifications CASCADE;
    DROP TABLE IF EXISTS medicine_batches CASCADE;
    DROP TABLE IF EXISTS medicines CASCADE;
    DROP TABLE IF EXISTS customers CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    DROP TYPE IF EXISTS medicine_batches_status_enum;
    DROP TYPE IF EXISTS users_role_enum;
  `);
}
