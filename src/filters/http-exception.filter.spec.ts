import { HttpExceptionFilter } from './http-exception.filter';

describe('TestFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });
});
