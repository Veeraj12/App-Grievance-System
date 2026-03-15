import { prisma } from "../prisma"
import { predictDepartment } from "../fuzzyClassifier"

export async function processComplaint(complaintId: number, text: string) {

  const deptName = predictDepartment(text)

  if (!deptName) return

  const department = await prisma.department.findFirst({
    where: { name: deptName }
  })

  if (!department) return

  await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      departmentId: department.id,
      status: "ASSIGNED"
    }
  })
}