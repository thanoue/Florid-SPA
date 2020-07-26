import * as adminSdk from '../helper/admin.sdk';

export async function updateIndex(deletedIndex: number): Promise<any> {

    return adminSdk.defauDatabase.ref("tags").orderByChild('Index')
        .startAt(deletedIndex + 1).once('value')
        .then((snapshot: any) => {

            try {
                const tags: any[] = [];

                snapshot.forEach((snap: any) => {
                    const tag = snap.val();
                    if (tag.Index > deletedIndex) {
                        tags.push(tag);
                    }
                });

                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                tags.forEach((tag: any) => {

                    updates[`/${tag.Id}/Index`] = deletedIndex;
                    deletedIndex += 1;

                });

                return adminSdk.defauDatabase.ref('tags').update(updates);
            }
            catch (error) {
                throw error;
            }

        });
}