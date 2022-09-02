import request from './request';

export default {
    async GetDayStories(query) {
      try {
        const res = await request.get('GetDayStories', query);
        return res;
      } catch (e) {
        console.error(Object.keys(e), e.message);
        throw new Error(e.message);
      }
    },
    async AddStory(body) {
      try {
        const res = await request.post('AddStory', body);
        return res;
      } catch (e) {
        console.error(Object.keys(e), e.message);
        throw new Error(e.message);
      }
    },
    async DeleteStory(body) {
      try {
        const res = await request.delete('DeleteStory', body);
        return res;
      } catch (e) {
        console.error(Object.keys(e), e.message);
        throw new Error(e.message);
      }
    },
  }