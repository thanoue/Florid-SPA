import * as adminSdk from '../helper/admin.sdk';

export async function searchProduct(term: string): Promise<any> {
    return adminSdk.defauDatabase.ref('products')
        .orderByChild('Name')
        .startAt(term)
        .endAt(term + '\uf8ff')
        .once('value')
        .then((res: any) => {

            const customers: any[] = [];

            res.forEach((snapShot: any) => {
                customers.push(snapShot.val());
            });

            return customers;
        });
}

export async function updateIndex(startIndex: number, delta: number): Promise<any> {

    console.log('start index:', startIndex);

    return adminSdk.defauDatabase.ref("products").orderByChild('Index')
        .startAt(startIndex).once('value')
        .then((snapshot: any) => {

            try {
                const products: any[] = [];

                if (snapshot) {
                    snapshot.forEach((snap: any) => {
                        const product = snap.val();
                        products.push(product);
                    });
                }

                if (products.length <= 0) {
                    return;
                }

                console.log('index updating count:', products.length);


                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                products.forEach((product: any) => {
                    updates[`/${product.Id}/Index`] = product.Index + delta;
                });

                return adminSdk.defauDatabase.ref('/products').update(updates);
            }
            catch (error) {
                throw error;
            }

        });
}

export async function updateProductIndexMultiple(smallestIndex: number, smallestCateIndexes: number[]): Promise<any> {

    let startIndex = smallestIndex + 1;

    console.log(smallestIndex, smallestCateIndexes);

    return adminSdk.defauDatabase.ref('products').orderByChild('Index')
        .startAt(startIndex)
        .once('value')
        .then(async (snapshot: any) => {
            if (snapshot) {

                const globalProducts: any[] = [];

                snapshot.forEach((snap: any) => {
                    let product = snap.val();
                    globalProducts.push(product);
                });

                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                globalProducts.forEach((product: any) => {
                    updates[`/${product.Id}/Index`] = startIndex;
                    startIndex++;
                });

                smallestCateIndexes.forEach((categoryIndex: number) => {

                    let startCateIndex = categoryIndex += 1;

                    const offset = categoryIndex - (categoryIndex % 10000);
                    const cateUpdates: any[] = [];

                    globalProducts.forEach(product => {

                        if (product.CategoryIndex >= startCateIndex && product.CategoryIndex <= (9999 + offset)) {
                            cateUpdates.push(product);
                        }

                    });

                    cateUpdates.forEach(product => {

                        updates[`/${product.Id}/CategoryIndex`] = startCateIndex;
                        startCateIndex += 1;

                    });

                });

                return await adminSdk.defauDatabase.ref('/products').update(updates);

            } else {
                return;
            }
        })
}

export async function updateCategoryIndex(startIndex: number, delta: number): Promise<number> {

    const offset = startIndex - (startIndex % 10000);

    console.log(offset, startIndex, delta);

    return adminSdk.defauDatabase.ref("products").orderByChild('CategoryIndex')
        .startAt(startIndex)
        .endAt(9999 + offset).once('value')
        .then(async (snapshot: any) => {

            try {

                const products: any[] = [];

                if (snapshot) {

                    snapshot.forEach((snap: any) => {
                        let product = snap.val();
                        products.push(product);
                    });
                }

                console.log('category index updateing count:', products.length);

                if (products.length <= 0) {

                    return adminSdk.defauDatabase.ref('products').orderByChild('CategoryIndex')
                        .startAt(1 + offset + 10000)
                        .endAt(2 + offset + 10000)
                        .limitToFirst(1)
                        .once('value')
                        .then((snapshot: any) => {

                            let newProds: any;

                            snapshot.forEach((snap: any) => {
                                let product = snap.val();
                                newProds = product;
                            });

                            if (!newProds || newProds == undefined || newProds == null)
                                return 0;

                            return newProds.Index;

                        });
                }

                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                products.forEach((product: any) => {
                    updates[`/${product.Id}/CategoryIndex`] = product.CategoryIndex + delta;
                });

                await adminSdk.defauDatabase.ref('/products').update(updates);

                return products[0].Index;
            }
            catch (error) {
                throw error;
            }

        });
}