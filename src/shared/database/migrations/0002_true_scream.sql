INSERT INTO "organization_role" (
	"id",
	"organization_id",
	"role",
	"permission",
	"created_at",
	"updated_at"
)
SELECT
	"organization"."id" || ':role:owner',
	"organization"."id",
	'owner',
	'{"organization":["update","delete"],"member":["create","update","delete"],"invitation":["create","cancel"],"team":["create","update","delete"],"ac":["create","read","update","delete"]}',
	now(),
	now()
FROM "organization"
WHERE NOT EXISTS (
	SELECT 1
	FROM "organization_role"
	WHERE
		"organization_role"."organization_id" = "organization"."id"
		AND "organization_role"."role" = 'owner'
);
--> statement-breakpoint
INSERT INTO "organization_role" (
	"id",
	"organization_id",
	"role",
	"permission",
	"created_at",
	"updated_at"
)
SELECT
	"organization"."id" || ':role:admin',
	"organization"."id",
	'admin',
	'{"organization":["update"],"invitation":["create","cancel"],"member":["create","update","delete"],"team":["create","update","delete"],"ac":["create","read","update","delete"]}',
	now(),
	now()
FROM "organization"
WHERE NOT EXISTS (
	SELECT 1
	FROM "organization_role"
	WHERE
		"organization_role"."organization_id" = "organization"."id"
		AND "organization_role"."role" = 'admin'
);
--> statement-breakpoint
INSERT INTO "organization_role" (
	"id",
	"organization_id",
	"role",
	"permission",
	"created_at",
	"updated_at"
)
SELECT
	"organization"."id" || ':role:member',
	"organization"."id",
	'member',
	'{"organization":[],"member":[],"invitation":[],"team":[],"ac":["read"]}',
	now(),
	now()
FROM "organization"
WHERE NOT EXISTS (
	SELECT 1
	FROM "organization_role"
	WHERE
		"organization_role"."organization_id" = "organization"."id"
		AND "organization_role"."role" = 'member'
);
--> statement-breakpoint
CREATE UNIQUE INDEX "organizationRole_organizationId_role_uidx" ON "organization_role" USING btree ("organization_id","role");
