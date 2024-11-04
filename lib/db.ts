import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

export async function getUserProjects(userId: string) {
  try {
    const projects = await db.project.findMany({
      where: { userId },
      include: { images: true },
    })
    logger.info(`Retrieved ${projects.length} projects for user ${userId}`)
    return projects
  } catch (error) {
    logger.error(`Error retrieving projects for user ${userId}:`, error)
    throw error
  }
}

export async function createProject(userId: string, name: string, description?: string) {
  try {
    const project = await db.project.create({
      data: { userId, name, description },
    })
    logger.info(`Created new project ${project.id} for user ${userId}`)
    return project
  } catch (error) {
    logger.error(`Error creating project for user ${userId}:`, error)
    throw error
  }
}

export async function addImageToProject(projectId: string, imageUrl: string) {
  try {
    const image = await db.image.create({
      data: { projectId, url: imageUrl },
    })
    logger.info(`Added image ${image.id} to project ${projectId}`)
    return image
  } catch (error) {
    logger.error(`Error adding image to project ${projectId}:`, error)
    throw error
  }
}

export async function addAnimationToImage(imageId: string, type: string, settings: any) {
  try {
    const animation = await db.animation.create({
      data: { imageId, type, settings },
    })
    logger.info(`Added animation ${animation.id} to image ${imageId}`)
    return animation
  } catch (error) {
    logger.error(`Error adding animation to image ${imageId}:`, error)
    throw error
  }
}

export async function getSubscription(userId: string) {
  try {
    const subscription = await db.user.findUnique({
      where: { id: userId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    })
    logger.info(`Retrieved subscription for user ${userId}`)
    return subscription
  } catch (error) {
    logger.error(`Error retrieving subscription for user ${userId}:`, error)
    throw error
  }
}

export async function updateUserSubscription(
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePriceId: string,
  stripeCurrentPeriodEnd: Date
) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        stripeCurrentPeriodEnd,
      },
    })
    logger.info(`Updated subscription for user ${userId}`)
    return updatedUser
  } catch (error) {
    logger.error(`Error updating subscription for user ${userId}:`, error)
    throw error
  }
}

export async function deleteProject(projectId: string) {
  try {
    await db.project.delete({
      where: { id: projectId },
    })
    logger.info(`Deleted project ${projectId}`)
  } catch (error) {
    logger.error(`Error deleting project ${projectId}:`, error)
    throw error
  }
}

export async function updateProject(projectId: string, data: { name?: string; description?: string }) {
  try {
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data,
    })
    logger.info(`Updated project ${projectId}`)
    return updatedProject
  } catch (error) {
    logger.error(`Error updating project ${projectId}:`, error)
    throw error
  }
}