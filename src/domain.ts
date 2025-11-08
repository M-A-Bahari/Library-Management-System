export class Book {
  constructor(
    public id: string,
    public title: string,
    public count: number = 1
  ) {}
}

export class Member {
  public borrowed: string[] = [];

  constructor(
    public id: string,
    public name: string
  ) {}
}