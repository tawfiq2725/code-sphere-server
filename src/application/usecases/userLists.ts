import { Person } from "../../domain/entities/User";
import { UserInterface } from "../../domain/interface/User";
import { PaginationOptions } from "../../utils/queryHelper";

export class GetAllUsers {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<Person[]> {
    return this.userRepository.getAllUsers(options);
  }
}

export class GetAllTutor {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<Person[]> {
    const tutorList = this.userRepository.getAllTutor(options);
    return tutorList;
  }
}
export class GetAllTutorApplication {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(options: PaginationOptions): Promise<Person[]> {
    const tutorList = this.userRepository.getAllTutorApplication(options);
    return tutorList;
  }
}
