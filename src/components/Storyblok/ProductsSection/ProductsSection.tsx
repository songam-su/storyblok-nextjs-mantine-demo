'use client';

import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { ProductsSection as ProductsSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { SimpleGrid, Stack } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import styles from './ProductsSection.module.scss';

type PluginProductItem = {
  id?: string;
  sku?: string;
  name?: string;
  slug?: string;
  type?: string;
  image?: string;
  description?: string;
  price?: string | number;
  currency?: string;
  soldOut?: boolean;
  sold_out?: boolean;
  available?: boolean;
};

type FakeEcommercePluginValue = {
  plugin?: string;
  items?: PluginProductItem[];
};

const isFakeEcommercePluginValue = (value: unknown): value is FakeEcommercePluginValue =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const DEMO_PRODUCT_CATALOG: Record<
  string,
  {
    price: number;
    currency: string;
    soldOut?: boolean;
  }
> = {
  'SB-TSHIRT-WHT-001': { price: 39.99, currency: 'USD' },
  'SB-MUG-001': { price: 0, currency: 'USD', soldOut: true },
  'SB-SOCKS-001': { price: 4.99, currency: 'USD' },
};

const formatPrice = (value: number, currency: string) => {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded.toFixed(2)} ${currency}`;
};

const getProductPriceLabel = (product: PluginProductItem) => {
  const catalogEntry = product.sku ? DEMO_PRODUCT_CATALOG[product.sku] : undefined;

  const isSoldOut =
    Boolean(product.soldOut || product.sold_out) ||
    (typeof product.available === 'boolean' && !product.available) ||
    Boolean(catalogEntry?.soldOut);

  if (isSoldOut) {
    return { kind: 'sold-out' as const };
  }

  if (typeof product.price === 'number') {
    return {
      kind: 'price' as const,
      label: formatPrice(product.price, product.currency ?? 'USD'),
    };
  }

  if (typeof product.price === 'string' && product.price.trim().length > 0) {
    const currency = product.currency ? ` ${product.currency}` : '';
    return {
      kind: 'price' as const,
      label: `${product.price.trim()}${currency}`,
    };
  }

  if (catalogEntry) {
    return {
      kind: 'price' as const,
      label: formatPrice(catalogEntry.price, catalogEntry.currency),
    };
  }

  return null;
};

const ProductsSection = ({ blok }: SbComponentProps<ProductsSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const pluginValueRaw = (blok as any)?.plugin as unknown;
  const pluginValue = isFakeEcommercePluginValue(pluginValueRaw) ? pluginValueRaw : undefined;
  const products = Array.isArray(pluginValue?.items) ? pluginValue!.items!.filter(Boolean) : [];
  const hasPlugin = Boolean(pluginValue);

  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);

  if (!hasHeader && !hasPlugin) {
    return <section {...editable} className={styles.section} />;
  }

  return (
    <section {...editable} className={styles.section}>
      <Stack gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={blok.headline} lead={blok.lead} />}

        {hasPlugin && (
          <div className={styles.products}>
            {products.length > 0 ? (
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing={{ base: 'lg', sm: 'xl', lg: 'lg' }}
                verticalSpacing="xl"
                className={styles.grid}
              >
                {products.map((product, index) => {
                  const key = product.id ?? product.sku ?? product.slug ?? `${blok._uid}-product-${index}`;
                  const priceMeta = getProductPriceLabel(product);

                  return (
                    <div key={key} className={styles.card}>
                      {product.image ? (
                        <div className={styles.imageWrap}>
                          <Image
                            src={product.image}
                            alt={product.name ?? ''}
                            fill
                            className={styles.image}
                            sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      ) : null}

                      <div className={styles.body}>
                        {product.name ? <h3 className={styles.title}>{product.name}</h3> : null}
                        {product.description ? <p className={styles.description}>{product.description}</p> : null}

                        {priceMeta ? (
                          <div className={styles.price}>
                            {priceMeta.kind === 'sold-out' ? (
                              <span className={styles.soldOut}>Sold out</span>
                            ) : (
                              <span>{priceMeta.label}</span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </SimpleGrid>
            ) : (
              <div className={styles.pluginBox}>No products selected in the plugin field.</div>
            )}
          </div>
        )}
      </Stack>
    </section>
  );
};

export default ProductsSection;
