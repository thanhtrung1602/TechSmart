export interface IBlog {
  id: number;
  date: Date;
  date_gmt: Date;
  guid: {
    rendered: string;
  };
  modified: Date;
  modified_gmt: Date;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
}

export default class Blog implements IBlog {
  id: number;
  date: Date;
  date_gmt: Date;
  guid: {
    rendered: string;
  };
  modified: Date;
  modified_gmt: Date;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;

  constructor(data: IBlog) {
    this.id = data.id;
    this.date = data.date;
    this.date_gmt = data.date_gmt;
    this.guid = {
      rendered: data.guid.rendered,
    };
    this.modified = data.modified;
    this.modified_gmt = data.modified_gmt;
    this.slug = data.slug;
    this.status = data.status;
    this.type = data.type;
    this.link = data.link;
    this.title = {
      rendered: data.title.rendered,
    };
    this.content = {
      rendered: data.content.rendered,
      protected: data.content.protected,
    };
    this.excerpt = {
      rendered: data.excerpt.rendered,
      protected: data.excerpt.protected,
    };
    this.author = data.author;
    this.featured_media = data.featured_media;
    this.comment_status = data.comment_status;
    this.ping_status = data.ping_status;
    this.sticky = data.sticky;
    this.template = data.template;
    this.format = data.format;
  }
}
