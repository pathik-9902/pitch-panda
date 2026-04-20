const SplitedSlot = require('../models/SplitedSlot'); // Adjust the path as per your project structure

// Function to delete slots from the previous date
async function deleteSlots() {
  try {
    // Calculate previous date in "DD-MM-YYYY" format
    const today = new Date();
    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - 1); // Go back one day

    const formattedDate = formatDate(previousDate); // Format date as "DD-MM-YYYY"

    // Delete slots with slotDate less than the formatted previous date
    const deleteResult = await SplitedSlot.deleteMany({ slotDate: formattedDate });

    console.log(`Deleted ${deleteResult.deletedCount} slots from ${formattedDate}`);
  } catch (error) {
    console.error('Error deleting slots:', error);
  } finally {
  }
}

// Helper function to format date as "DD-MM-YYYY"
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

module.exports = deleteSlots;
