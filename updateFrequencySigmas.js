// const { prisma } = require('./lib/prisma');
const prisma = require('./lib/prisma').prisma;

async function updateFrequencySigma() {
  const nodes = await prisma.node.findMany({ orderBy: { idx: 'asc' } });

  let frequencySigma = 0;
  for (const node of nodes) {
    await prisma.node.update({
      where: { id: node.id },
      data: {
        frequencySigma: node.frequencySigma === null ? 0 : frequencySigma,
      },
    });
    frequencySigma += node.frequency;
  }
}

updateFrequencySigma()
  .then(() => {
    console.log('FrequencySigma values updated successfully.');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('Error updating FrequencySigma values:', error);
    prisma.$disconnect();
  });