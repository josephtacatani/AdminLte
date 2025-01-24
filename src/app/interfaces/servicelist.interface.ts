export interface Service {
    id: number;
    service_name: string;
    title: string;
    content: string;
    photo: string;
  }
  
  export interface ServicesListResponse {
    message: string;
    data: Service[];
  }
  
  export interface ServiceResponse {
    message: string;
    data: Service;
  }
  