interface IStatus {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

class Status implements IStatus {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(id: number, status: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Status;
