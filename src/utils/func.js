const formatTime = (time) => {
   return time.split('T')[1].split(':', 2).join(':');
};

export { formatTime };
