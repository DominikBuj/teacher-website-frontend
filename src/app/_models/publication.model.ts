export class Publication {
  id: number;
  title: string;
  subtitle: string;
  publisher: string;
  type: string;
  link: string;
  date: number;

  constructor(
    id: number,
    title: string,
    subtitle: string,
    publisher: string,
    type: string,
    link: string,
    date: number
  ) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.publisher = publisher;
    this.type = type;
    this.link = link;
    this.date = date;
  }
}
