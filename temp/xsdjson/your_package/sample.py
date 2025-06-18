from dataclasses import dataclass, field
from decimal import Decimal
from typing import Optional

from xsdata.models.datatype import XmlPeriod

__NAMESPACE__ = "http://example.com/bookstore"


@dataclass
class AuthorType:
    first_name: Optional[str] = field(
        default=None,
        metadata={
            "name": "FirstName",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
            "required": True,
        },
    )
    last_name: Optional[str] = field(
        default=None,
        metadata={
            "name": "LastName",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
            "required": True,
        },
    )
    birth_year: Optional[XmlPeriod] = field(
        default=None,
        metadata={
            "name": "BirthYear",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
        },
    )
    id: Optional[str] = field(
        default=None,
        metadata={
            "type": "Attribute",
            "required": True,
        },
    )


@dataclass
class BookType:
    title: Optional[str] = field(
        default=None,
        metadata={
            "name": "Title",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
            "required": True,
        },
    )
    isbn: Optional[str] = field(
        default=None,
        metadata={
            "name": "ISBN",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
            "required": True,
            "pattern": r"\d{3}-\d{10}",
        },
    )
    author: list[AuthorType] = field(
        default_factory=list,
        metadata={
            "name": "Author",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
            "min_occurs": 1,
        },
    )
    published_year: Optional[XmlPeriod] = field(
        default=None,
        metadata={
            "name": "PublishedYear",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
            "required": True,
        },
    )
    price: Optional[Decimal] = field(
        default=None,
        metadata={
            "name": "Price",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
            "required": True,
        },
    )
    review: list[str] = field(
        default_factory=list,
        metadata={
            "name": "Review",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
        },
    )
    rating: list[int] = field(
        default_factory=list,
        metadata={
            "name": "Rating",
            "type": "Element",
            "namespace": "http://example.com/bookstore",
        },
    )
    category: Optional[str] = field(
        default=None,
        metadata={
            "type": "Attribute",
        },
    )


@dataclass
class Bookstore:
    class Meta:
        namespace = "http://example.com/bookstore"

    book: list[BookType] = field(
        default_factory=list,
        metadata={
            "name": "Book",
            "type": "Element",
            "min_occurs": 1,
        },
    )
