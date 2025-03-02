
export const getStatusColor = (status: "ACTIVE" | "CLOSED" | "SUSPENDED") => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-blue-500 hover:bg-blue-500';
    case 'CLOSED':
      return 'bg-gray-500 hover:bg-gray-500';
    case 'SUSPENDED':
      return 'bg-orange-400 hover:bg-orange-400';
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
      return 'bg-green-500 hover:bg-green-500';
    case 'failed':
      return 'bg-red-500 hover:bg-red-500';
    case 'pending':
      return 'bg-yellow-500 hover:bg-yellow-500';
    case 'cancelled':
      return 'bg-gray-500 hover:bg-gray-500';
    default:
      return 'bg-gray-500 hover:bg-gray-500';
  }
};
