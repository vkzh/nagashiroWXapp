import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');

  return delay().then(() => {
    const fetchResult = getGoodsList(pageIndex, pageSize);
    console.log("fetchResult:", fetchResult);

    return fetchResult.map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        title_jp: item.title_jp,
        title_en: item.title_en,
        subTitle: item.skuList[0].weight.desc,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    });
  });
}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20) {
  if (config.useMock) {
    return mockFetchGoodsList(pageIndex, pageSize);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}
