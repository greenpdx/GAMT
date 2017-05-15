import { GamtPage } from './app.po';

describe('gamt App', () => {
  let page: GamtPage;

  beforeEach(() => {
    page = new GamtPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
