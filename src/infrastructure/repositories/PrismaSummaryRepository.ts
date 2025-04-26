import { PrismaClient } from '@/generated/prisma';
import { SummaryRepository } from '@/domain/repositories/SummaryRepository';
import { Summary, Tag, Blocker, Suggestion } from '@/domain/entities/Summary';

export class PrismaSummaryRepository implements SummaryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(summary: Summary): Promise<Summary> {
    const createdSummary = await this.prisma.summary.create({
      data: {
        id: summary.id,
        text: summary.text,
        date: summary.date,
        userId: summary.userId,
        projectId: summary.projectId,
        createdAt: summary.createdAt,
        updatedAt: summary.updatedAt
      },
      include: {
        tags: true,
        blockers: true,
        suggestions: true
      }
    });

    return new Summary(
      createdSummary.text,
      createdSummary.userId,
      createdSummary.projectId,
      createdSummary.date,
      createdSummary.tags.map(tag => ({ id: tag.id, name: tag.name })),
      createdSummary.blockers.map(blocker => ({ id: blocker.id, name: blocker.name })),
      createdSummary.suggestions.map(suggestion => ({ id: suggestion.id, text: suggestion.text })),
      createdSummary.id,
      createdSummary.createdAt,
      createdSummary.updatedAt
    );
  }

  async findById(id: string): Promise<Summary | null> {
    const summary = await this.prisma.summary.findUnique({
      where: { id },
      include: {
        tags: true,
        blockers: true,
        suggestions: true
      }
    });

    if (!summary) return null;

    return new Summary(
      summary.text,
      summary.userId,
      summary.projectId,
      summary.date,
      summary.tags.map(tag => ({ id: tag.id, name: tag.name })),
      summary.blockers.map(blocker => ({ id: blocker.id, name: blocker.name })),
      summary.suggestions.map(suggestion => ({ id: suggestion.id, text: suggestion.text })),
      summary.id,
      summary.createdAt,
      summary.updatedAt
    );
  }

  async findByUserId(userId: string, limit?: number): Promise<Summary[]> {
    const summaries = await this.prisma.summary.findMany({
      where: { userId },
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        tags: true,
        blockers: true,
        suggestions: true
      }
    });

    return summaries.map(summary => new Summary(
      summary.text,
      summary.userId,
      summary.projectId,
      summary.date,
      summary.tags.map(tag => ({ id: tag.id, name: tag.name })),
      summary.blockers.map(blocker => ({ id: blocker.id, name: blocker.name })),
      summary.suggestions.map(suggestion => ({ id: suggestion.id, text: suggestion.text })),
      summary.id,
      summary.createdAt,
      summary.updatedAt
    ));
  }

  async findByProjectId(projectId: string, limit?: number): Promise<Summary[]> {
    const summaries = await this.prisma.summary.findMany({
      where: { projectId },
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        tags: true,
        blockers: true,
        suggestions: true
      }
    });

    return summaries.map(summary => new Summary(
      summary.text,
      summary.userId,
      summary.projectId,
      summary.date,
      summary.tags.map(tag => ({ id: tag.id, name: tag.name })),
      summary.blockers.map(blocker => ({ id: blocker.id, name: blocker.name })),
      summary.suggestions.map(suggestion => ({ id: suggestion.id, text: suggestion.text })),
      summary.id,
      summary.createdAt,
      summary.updatedAt
    ));
  }

  async findByPeriod(params: {
    projectId?: string;
    userId?: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Summary[]> {
    const { projectId, userId, startDate, endDate } = params;

    const where: any = {
      date: {
        gte: startDate,
        lte: endDate
      }
    };

    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;

    const summaries = await this.prisma.summary.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        tags: true,
        blockers: true,
        suggestions: true
      }
    });

    return summaries.map(summary => new Summary(
      summary.text,
      summary.userId,
      summary.projectId,
      summary.date,
      summary.tags.map(tag => ({ id: tag.id, name: tag.name })),
      summary.blockers.map(blocker => ({ id: blocker.id, name: blocker.name })),
      summary.suggestions.map(suggestion => ({ id: suggestion.id, text: suggestion.text })),
      summary.id,
      summary.createdAt,
      summary.updatedAt
    ));
  }

  async createTag(tag: Tag): Promise<Tag> {
    const createdTag = await this.prisma.tag.create({
      data: {
        id: tag.id,
        name: tag.name
      }
    });

    return { id: createdTag.id, name: createdTag.name };
  }

  async findTagByName(name: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: { name }
    });

    if (!tag) return null;
    return { id: tag.id, name: tag.name };
  }

  async createBlocker(blocker: Blocker): Promise<Blocker> {
    const createdBlocker = await this.prisma.blocker.create({
      data: {
        id: blocker.id,
        name: blocker.name
      }
    });

    return { id: createdBlocker.id, name: createdBlocker.name };
  }

  async findBlockerByName(name: string): Promise<Blocker | null> {
    const blocker = await this.prisma.blocker.findUnique({
      where: { name }
    });

    if (!blocker) return null;
    return { id: blocker.id, name: blocker.name };
  }

  async createSuggestion(suggestion: Suggestion): Promise<Suggestion> {
    const createdSuggestion = await this.prisma.suggestion.create({
      data: {
        id: suggestion.id,
        text: suggestion.text
      }
    });

    return { id: createdSuggestion.id, text: createdSuggestion.text };
  }

  async addTagToSummary(summaryId: string, tagId: string): Promise<void> {
    await this.prisma.summary.update({
      where: { id: summaryId },
      data: {
        tags: {
          connect: { id: tagId }
        }
      }
    });
  }

  async addBlockerToSummary(summaryId: string, blockerId: string): Promise<void> {
    await this.prisma.summary.update({
      where: { id: summaryId },
      data: {
        blockers: {
          connect: { id: blockerId }
        }
      }
    });
  }

  async addSuggestionToSummary(summaryId: string, suggestionId: string): Promise<void> {
    await this.prisma.summary.update({
      where: { id: summaryId },
      data: {
        suggestions: {
          connect: { id: suggestionId }
        }
      }
    });
  }
} 