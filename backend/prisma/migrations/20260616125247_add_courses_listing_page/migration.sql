-- CreateTable
CREATE TABLE "courses_listing_page" (
    "id" TEXT NOT NULL,
    "heroTag" TEXT NOT NULL,
    "heroHeadingMain" TEXT NOT NULL,
    "heroHeadingAccent" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "whoTag" TEXT NOT NULL,
    "whoHeadingMain" TEXT NOT NULL,
    "whoHeadingAccent" TEXT NOT NULL,
    "ctaTag" TEXT NOT NULL,
    "ctaHeading" TEXT NOT NULL,
    "ctaDesc" TEXT NOT NULL,
    "ctaBtnPrimary" TEXT NOT NULL,
    "ctaBtnSecondary" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_listing_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses_listing_who_cards" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "courses_listing_who_cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "courses_listing_who_cards" ADD CONSTRAINT "courses_listing_who_cards_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "courses_listing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
