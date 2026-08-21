-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_usuarioId_postId_key" ON "Like"("usuarioId", "postId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
