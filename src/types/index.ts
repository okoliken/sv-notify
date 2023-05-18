

export interface Notify {
    uuid: string;
    description: string;
    created_at: string;
    avatar: string;
    status: boolean;
    comment: string | null;
    photo_comment: string | null;
  }

  export interface Count {
    status: boolean;
  }