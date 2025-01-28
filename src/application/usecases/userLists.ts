import { Person } from "../../domain/entities/User";
import { UserInterface } from "../../domain/interface/User";

export class GetAllUsers {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(): Promise<Person[]> {
    return this.userRepository.getAllUsers();
  }
}

export class GetAllTutor {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(): Promise<Person[]> {
    const tutorList = this.userRepository.getAllTutor();
    return tutorList;
  }
}
export class GetAllTutorApplication {
  constructor(private readonly userRepository: UserInterface) {}
  async execute(): Promise<Person[]> {
    const tutorList = this.userRepository.getAllTutorApplication();
    return tutorList;
  }
}
