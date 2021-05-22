import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageService } from '../page/page.service';
import { User } from '../user/entities/user.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Page } from '../page/entities/page.entity';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  constructor(
    private readonly pageService: PageService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async subscribePage(pageId: number, user: User) {
    return this.pageService.findById(pageId).then(async (page) => {
      const newSubscription = this.subscriptionRepository.create(
        new Subscription({ user, page }),
      );
      return this.subscriptionRepository
        .save(newSubscription)
        .catch((error) => {
          this.logger.error(error);
          throw new BadRequestException(`페이지를 구독할 수 없습니다.`);
        });
    });
  }

  async findAllSubscribePage(user: User) {
    return this.subscriptionRepository
      .find({ where: { user: user }, relations: ['page'] })
      .catch((error) => {
        this.logger.error(error);
        throw new NotFoundException(`구독중인 페이지를 찾을수 없습니다.`);
      });
  }

  async findAllUserBySubscribePage(page: Page) {
    return this.subscriptionRepository
      .find({ where: { page: page }, relations: ['user', 'page'] })
      .catch((error) => {
        this.logger.error(error);
        throw new NotFoundException(`구독 페이지 유저 정보를 찾을수 없습니다.`);
      });
  }

  async findOne(id: number, user: User) {
    const subscriptionById = this.subscriptionRepository.findOne({
      id: id,
      user: user,
    });
    if (!subscriptionById) {
      throw new NotFoundException(`구독 정보를 찾을수 없습니다.`);
    }
    return subscriptionById;
  }

  findAllFromPostCreatedDate(page: Page, createAt: Date) {
    return this.subscriptionRepository.find({
      where: {
        page: page,
        createAt: LessThanOrEqual(createAt),
      },
      relations: ['user'],
    });
  }

  async remove(id: number, user: User) {
    return this.findOne(id, user).then(async (subscription) => {
      return this.subscriptionRepository.remove(subscription).catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(`구독을 취소하는데 실패하였습니다.`);
      });
    });
  }
}
