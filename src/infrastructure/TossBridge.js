export async function convertToTossPoint(point) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { success: point > 0, spent: point };
}
