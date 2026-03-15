import { prisma } from "../prisma"
import { predictDepartment } from "../fuzzyClassifier"

export async function processComplaint(complaintId: number, subject: string, description: string) {

  const deptName = predictDepartment(subject, description)

  if (!deptName) return

  await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      departmentName: deptName,
      status: "ASSIGNED"
    }
  })
}