import { Link } from '@tanstack/react-router';
import { Skeleton } from 'loadshape';
import { StandLayout } from '../../shared/ui/StandLayout';
import styles from './styles.module.css';

const COVER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='120'%3E%3Crect fill='%232b59ff' width='320' height='120'/%3E%3C/svg%3E";

export function EdgesStand() {
  return (
    <StandLayout title="Edge cases">
      {(isLoading) => (
        <div id="edges" className={styles.grid}>
          <section className={styles.case}>
            <h2 className={styles.case_title}>Inline root and button root</h2>
            <p>
              Total:{' '}
              <Skeleton.Root loading={isLoading} render={<span className={styles.price} />}>
                $12.80
              </Skeleton.Root>
            </p>
            <Skeleton.Root
              loading={isLoading}
              render={<button className={styles.action} type="button" />}
            >
              Buy for $12.80
            </Skeleton.Root>
            <Skeleton.Root
              loading={isLoading}
              render={<button className={styles.action} type="button" />}
            >
              <Skeleton.Static>Cancel</Skeleton.Static>
            </Skeleton.Root>
          </section>

          <Skeleton.Root loading={isLoading} render={<section className={styles.case} />}>
            <h2 className={styles.case_title}>Links and inline elements in text</h2>
            <Skeleton.Static render={<p className={styles.static_note} />}>
              Delivery terms{' '}
              <Link to="/stands/edges" hash="edges">
                learn more
              </Link>
              , <s>until Friday</s>
            </Skeleton.Static>
            <p>
              <Skeleton.Static>Total due:</Skeleton.Static> <span>$12.80</span>
            </p>
            <p>
              Delivery{' '}
              <Link to="/stands/edges" hash="edges">
                <Skeleton.Static>free</Skeleton.Static>
              </Link>{' '}
              from tomorrow: the block has no lines, and the label remains visible.
            </p>
            <div>
              <Skeleton.Static>Label without a wrapper</Skeleton.Static>
            </div>
            <p>
              The price is shown{' '}
              <Link to="/stands/edges" hash="edges">
                at this link
              </Link>
              , <s>old price $15</s> and <strong>new price $12.80</strong> with a discount until the
              end of the week.
            </p>
            <label className={styles.check}>
              <input type="checkbox" /> Remember me
            </label>
          </Skeleton.Root>

          <Skeleton.Root loading={isLoading} render={<section className={styles.case} />}>
            <h2 className={styles.case_title}>Styled form controls</h2>
            <select className={styles.field}>
              <option>London</option>
            </select>
            <input className={styles.field} type="search" placeholder="Search the catalog" />
            <textarea className={styles.field} rows={2} defaultValue="Order comment" />
            <button className={styles.field} type="button">
              Submit
            </button>
          </Skeleton.Root>

          <Skeleton.Root loading={isLoading} render={<section className={styles.case} />}>
            <h2 className={styles.case_title}>Picture element and divider</h2>
            <picture className={styles.picture}>
              <img className={styles.cover} src={COVER_SRC} alt="" />
            </picture>
            <hr className={styles.divider} />
            <p>A single line of text below the divider.</p>
          </Skeleton.Root>
        </div>
      )}
    </StandLayout>
  );
}
