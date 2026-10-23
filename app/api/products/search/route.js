import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const searchTerm = request.nextUrl.searchParams.get("search");
  const sortBy = request.nextUrl.searchParams.get("sort");
  const min = request.nextUrl.searchParams.get("min");
  const max = request.nextUrl.searchParams.get("max");
  const page = request.nextUrl.searchParams.get("page") || 1;
  const categorySlug = request.nextUrl.searchParams.get("category");
  const pageSize = 24;
  let where = {};
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { category: { title: { contains: searchTerm, mode: "insensitive" } } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (min && max) {
    where.salePrice = {
      gte: parseFloat(min),
      lte: parseFloat(max),
    };
  } else if (min) {
    where.salePrice = {
      gte: parseFloat(min),
    };
  } else if (max) {
    where.salePrice = {
      lte: parseFloat(max),
    };
  }
  try {
    const total = await db.product.count({ where });
    const products = await db.product.findMany({
      where,
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      take: parseInt(pageSize),
      orderBy: {
        salePrice: sortBy === "asc" ? "asc" : "desc",
      },
    });
    return NextResponse.json({ products, total });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Products",
      },
      { status: 500 }
    );
  }
}
