import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Review {
  id: string;
  productId: string;
  userId: string;
  userEmail?: string;
  userName: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: any;
}

export const ReviewSection: React.FC<{ productId: string }> = ({ productId }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    return unsubscribe;
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Anonymous',
        rating,
        comment,
        helpfulCount: 0,
        createdAt: serverTimestamp(),
      });
      setComment('');
      setRating(5);
      toast.success('Review submitted!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reviews');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-2xl font-bold">{t('products.reviews')} ({reviews.length})</h3>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${s <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
          <span className="font-bold">{averageRating.toFixed(1)}</span>
        </div>
      </div>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('products.addReview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder={t('products.comment')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? '...' : t('products.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold flex items-center gap-2">
                  {review.userName}
                  {review.userEmail === 'godswillk116@gmail.com' && (
                    <span className="flex items-center text-yellow-500 text-sm">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1 text-muted-foreground text-[10px]">(Owner)</span>
                    </span>
                  )}
                </p>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {review.createdAt?.toDate().toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
            <div className="mt-4 flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2 text-xs">
                <ThumbsUp className="h-3 w-3" />
                Helpful ({review.helpfulCount})
              </Button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">{t('products.noReviews')}</p>
        )}
      </div>
    </div>
  );
};
