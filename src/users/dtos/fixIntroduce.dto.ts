import { PickType } from '@nestjs/swagger';

import { Users } from '../entities/users.entity';

export class FixIntroduceDto extends PickType(Users, ['introduce'] as const) {}
