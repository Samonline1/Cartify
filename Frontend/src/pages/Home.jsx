import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHero from "../components/home/HomeHero";
import CategoryRail from "../components/home/CategoryRail";
import BrandRail from "../components/home/BrandRail";
import ProductSection from "../components/home/ProductSection";
import HomeSkeleton from "../components/home/HomeSkeleton";
import HomeErrorState from "../components/home/HomeErrorState";
import { useHomeProducts } from "../hooks/queries/useHomeProducts";

const Home = () => {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);

  const { data: products = [], isLoading, isError } = useHomeProducts();

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (!product.category || map.has(product.category)) return;

      map.set(product.category, {
        name: product.category,
        image: product.thumbnail,
      });
    });

    return Array.from(map.values());
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = new Map();

    products.forEach((product) => {
      if (!product.brand || uniqueBrands.has(product.brand)) return;

      uniqueBrands.set(product.brand, product.brand);
    });

    return Array.from(uniqueBrands.values());
  }, [products]);

  const heroProducts = useMemo(() => {
    return products
      .filter((product) => product.thumbnail)
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
      .slice(0, 5);
  }, [products]);

  const heroProduct = heroProducts[heroIndex % Math.max(heroProducts.length, 1)];

  const trendingProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
  }, [products]);

  const discountedProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
      .slice(0, 8);
  }, [products]);

  const popularProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 8);
  }, [products]);

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroProducts.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const formatCategory = (category) =>
    category?.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  const formatPrice = (price) => `₹${(price * 80).toFixed(0)}`;


  const openProduct = (product) => {
    navigate(`/search/${product.title}/${product.id}`);
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (isError) {
    return <HomeErrorState onRetry={() => window.location.reload()} />;
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-900">
      <HomeHero
        product={heroProduct}
        products={heroProducts}
        activeIndex={heroIndex}
        onPrev={() =>
          setHeroIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length)
        }
        onNext={() => setHeroIndex((prev) => (prev + 1) % heroProducts.length)}
        onDotClick={setHeroIndex}
        onOpenProduct={openProduct}
      />

      <CategoryRail
        categories={categories}
        activeIndex={categoryIndex}
        onCategoryClick={(category) => navigate(`/category/${category.name}`)}
        onPrev={() => setCategoryIndex((prev) => Math.max(prev - 1, 0))}
        onNext={() =>
          setCategoryIndex((prev) =>
            Math.min(prev + 1, Math.max(categories.length - 1, 0))
          )
        }
        formatCategory={formatCategory}
      />

      <BrandRail brands={brands} onBrandClick={(brand) => navigate(`/search/${brand}`)} />

      <ProductSection
        title="Trending Now"
        subtitle="Popular products people are checking out"
        products={trendingProducts}
        formatPrice={formatPrice}
        onProduct={openProduct}
      />

      <ProductSection
        title="Big Discounts"
        subtitle="More savings on products you may like"
        products={discountedProducts}
        formatPrice={formatPrice}
        onProduct={openProduct}
        highlightDiscount
      />

      <ProductSection
        title="Popular Picks"
        subtitle="Discover more products worth checking out"
        products={popularProducts}
        formatPrice={formatPrice}
        onProduct={openProduct}
      />
    </main>
  );
};

export default Home;
