export const getStatusColor = (status: "ACTIVE" | "CLOSED" | "SUSPENDED") => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500 hover:bg-green-500';
    case 'CLOSED':
      return 'bg-gray-500 hover:bg-gray-500';
    case 'SUSPENDED':
      return 'bg-red-500 hover:bg-red-500';
  }
};

export const getPriorityColor = (priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => {
  switch (priority) {
    case 'LOW':
      return 'bg-green-500 hover:bg-green-500';
    case 'MEDIUM':
      return 'bg-yellow-500 hover:bg-yellow-500';
    case 'HIGH':
      return 'bg-orange-500 hover:bg-orange-500';
    case 'URGENT':
      return 'bg-red-500 hover:bg-red-500';
  }
};

export const getCommsStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-gray-200 text-gray-700 hover:bg-gray-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
    default:
      return 'bg-red-100 text-red-700 hover:bg-red-100';
  }
};

export const getCommsTypeColor = (type: string) => {
  switch (type) {
    case 'call':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'email':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
    case 'sms':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  }
};
