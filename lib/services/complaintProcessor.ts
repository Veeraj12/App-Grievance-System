import { prisma } from "../prisma"
import { predictDepartment } from "../fuzzyClassifier"

export async function processComplaint(complaintId: number, subject: string, description: string) {

  // Step 1: Predict which department should handle this complaint
  const deptName = predictDepartment(subject, description)

  if (!deptName) return

  // Step 2: Check if that department has at least one STAFF user assigned
  const staffCount = await prisma.user.count({
    where: {
      role: "STAFF",
      department: {
        name: deptName,
      },
    },
  })

  const hasStaff = staffCount > 0

  // Step 3: Save department name; only promote to ASSIGNED if staff exists.
  // If no staff, stay OPEN so admin can see it in the Unassigned tab.
  await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      departmentName: deptName,
      status: hasStaff ? "ASSIGNED" : "OPEN",
    },
  })
}