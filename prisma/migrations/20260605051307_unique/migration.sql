/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[index]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lesson_name_key" ON "Lesson"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_index_key" ON "Lesson"("index");
